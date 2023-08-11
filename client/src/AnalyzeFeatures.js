import React from 'react';
import { useSelector } from 'react-redux';

const ss = require('simple-statistics');
const d3 = require('d3');

const makeCorrelogram = function(...args) {
    for (const array in args) {

    }
    
};

// input: data = [{"acousticness": }, ..., {"ad": }, ...]
const findStats = function(data) {
    // make boxplots
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#boxplots")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Read the data and compute summary statistics for each specie
        //console.log(data);

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    // nest function allows to group the calculation per level of a factor
    let sumstat = d3.rollup(function(d) {
        let q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
        let median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
        let q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
        let interQuantileRange = q3 - q1
        let min = q1 - 1.5 * interQuantileRange
        let max = q3 + 1.5 * interQuantileRange
        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    }) 
    .entries(data)

    // Show the X scale
    let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["setosa", "versicolor", "virginica"])
    .paddingInner(1)
    .paddingOuter(.5)
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    // Show the Y scale
    let y = d3.scaleLinear()
    .domain([3,9])
    .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Show the main vertical line
    svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d){return(x(d.key))})
    .attr("x2", function(d){return(x(d.key))})
    .attr("y1", function(d){return(y(d.value.min))})
    .attr("y2", function(d){return(y(d.value.max))})
    .attr("stroke", "black")
    .style("width", 40)

    // rectangle for the main box
    let boxWidth = 100
    svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    // Show the median
    svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
    .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
    .attr("y1", function(d){return(y(d.value.median))})
    .attr("y2", function(d){return(y(d.value.median))})
    .attr("stroke", "black")
    .style("width", 80)

    // Add individual points with jitter
    let jitterWidth = 50
    svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d){return(x(d.Species) - jitterWidth/2 + Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d.Sepal_Length))})
    .attr("r", 4)
    .style("fill", "white")
    .attr("stroke", "black")
};

const AnalyzeFeatures = function() {

    const features = useSelector((state) => state.features.value);

    /* is one combination of feature values similar to another? 
    = is say a .1 difference between the same feature value of one song versus
    another song significant? 
    how similar is one song to another? 
    */
    // measure relative differences between feature values of a song
    //const includedFeats = ["acousticness", "danceability", "energy", "valence"];

    // make data
    let featuresData = []; // [ {"acousticness": }. {"danceability": }, {"energy": } {"valence": } ...]
    //let fieldsArray = ["acousticness", "danceability", "energy", "valence"];
    let allDiffsArray = [];
    let adArray = [], aeArray = [], avArray = [], deArray = [], dvArray = [], 
          evArray = [];
    features.audio_features.forEach((track) => {
        let obj = {"acousticness": track.acousticness, 
                   "danceability": track.danceability, 
                   "energy": track.energy, 
                   "valence": track.valence, 
                   "ad": track.acousticness - track.danceability,
                   "ae": track.acousticness - track.energy,
                   "av": track.acousticness - track.valence,
                   "de": track.danceability - track.energy,
                   "dv": track.danceability - track.valence,
                   "ev": track.energy - track.valence};
        adArray.push(obj["ad"]);
        aeArray.push(obj["ae"]);
        avArray.push(obj["av"]);
        deArray.push(obj["de"]);
        dvArray.push(obj["dv"]);
        evArray.push(obj["ev"]);
        /*
        **TODO: modulate it?
        for (let field of fieldsArray) {
            obj[field] = track.${field};
        }*/
        featuresData.push(obj);
    })
    allDiffsArray.push(adArray, aeArray, avArray, deArray, dvArray, evArray);

    /* to find if any tracks have similar differences, check if any mean difference
    // is significant (?). use hypothesized mean of 0. 
    // should we compare means against each other?
    // each difference will tell you if the two features are dependent. looking at
    all diffs at once will tell you if the diffs are dependent. 
    */

    // make array for csv 
    let rows = [];
    let fields = ["ad", "ae", "av", "de", "dv", "ev"];
    // make csvContent without d3 for now (issue becoming difficult)
    //let csvContentTemp = [];
    for (let i = 0; i < fields.length; i++) { // i < num of fields
        let row = [];
        let rowTempObj = {};
        row.push(fields[i]); // field name
        for (let j = 0; j < fields.length; j++) {
            if (i === j) {
                row.push(1); // sampleCorrelation doesn't return exactly 1
                //rowTempObj[fields[j]] = 1;
            } else {
                row.push(ss.sampleCorrelation(allDiffsArray[i], allDiffsArray[j]));
                //rowTempObj[rows[0][j]] = ss.sampleCorrelation(allDiffsArray[i], allDiffsArray[j]);
            }
        }
        rows.push(row);
        //csvContentTemp.push(rowTempObj);
    }
    // insert "" at beginning, to rows[0][0]
    //rows[0].splice(0, 0, "");
    //csvContentTemp.push(fields); // depends on splicing in previous line

    // does not destructively modify rows
    let csvContent = rows.map(row => row.join(",")).join("\n");

    // source https://d3-graph-gallery.com/graph/correlogram_basic.html 
    //https://plnkr.co/edit/Va1Dw3hg2D5jPoNGKVWp?p=preview&preview

    // correlation matrix. =
    // Graph dimension
    const margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 430 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom

    const data = [];
    rows.forEach(function(d) {
        let x = d[0];
        //console.log(d[""]);
        //delete d[""];   
        for (let index = 1; index < d.length; index++) {
            let y = fields[index-1],
                value = d[index];
            data.push({
                x: x,
                y: y,
                value: +value // convert value to number, default is string 
            });
        }
    });

    // Create the svg area
    // remove any initial data
    d3.select("#correlogram svg").remove()

    const svg = d3.select("#correlogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

            // List of all variables and number of them
    const domain = Array.from(new Set(data.map(function(d) { return d.x })))
    const num = Math.sqrt(data.length)

    // Create a color scale
    const color = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#B22222", "#fff", "#000080"]);

    // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
    const size = d3.scaleSqrt()
        .domain([0, 1])
        .range([0, 9]);

    // X scale
    const x = d3.scalePoint()
        .range([0, width])
        .domain(domain)

    // Y scale
    const y = d3.scalePoint()
        .range([0, height])
        .domain(domain)

    // Create one 'g' element for each cell of the correlogram
    const cor = svg.selectAll(".cor")
        .data(data)
        .join("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
            return `translate(${x(d.x)}, ${y(d.y)})`
        });

    // Low left part + Diagonal: Add the text with specific color
    cor
        .filter(function(d){
        const ypos = domain.indexOf(d.y);
        const xpos = domain.indexOf(d.x);
        return xpos <= ypos;
        })
        .append("text")
        .attr("y", 5)
        .text(function(d) {
            if (d.x === d.y) {
            return d.x;
            } else {
            return d.value.toFixed(2);
            }
        })
        .style("font-size", 11)
        .style("text-align", "center")
        .style("fill", function(d){
            if (d.x === d.y) {
            return "#000";
            } else {
            return color(d.value);
            }
        });


    // Up right part: add circles
    cor
        .filter(function(d){
        const ypos = domain.indexOf(d.y);
        const xpos = domain.indexOf(d.x);
        return xpos > ypos;
        })
        .append("circle")
        .attr("r", function(d){ return size(Math.abs(d.value)) })
        .style("fill", function(d){
            if (d.x === d.y) {
            return "#000";
            } else {
            return color(d.value);
            }
        })
        .style("opacity", 0.8)

    let aS = d3.scaleLinear()
      .range([-margin.top + 5, height + margin.bottom - 5])
      .domain([1, -1]);

    let yA = d3.axisRight(aS)
      .tickPadding(7);

    let aG = svg.append("g")
      .attr("class", "y axis")
      .call(yA)
      .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)")

    let iR = d3.range(-1, 1.01, 0.01);
    let h = height / iR.length + 3;
    iR.forEach(function(d){
        aG.append('rect')
          .style('fill',color(d))
          .style('stroke-width', 0)
          .style('stoke', 'none')
          .attr('height', h)
          .attr('width', 10)
          .attr('x', 0)
          .attr('y', aS(d))
    });

    findStats(featuresData);

    return (
        <>
            <div id="correlogram" className="bg-pink-500">
            </div>
            <div id="boxplots" className="bg-pink-500">
            </div>
        </>
    );
};

export default AnalyzeFeatures;
