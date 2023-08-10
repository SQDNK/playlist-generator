import React from 'react';
import { useSelector } from 'react-redux';

const ss = require('simple-statistics');
const d3 = require('d3');

const makeCorrelogram = function(...args) {
    for (const array in args) {

    }
    
}

const AnalyzeFeatures = function() {

    const features = useSelector((state) => state.features.value);

    /* is one combination of feature values similar to another? 
    = is say a .1 difference between the same feature value of one song versus
    another song significant? 
    how similar is one song to another? 
    */
    // measure relative differences between feature values of a song
    //const includedFeats = ["acousticness", "danceability", "energy", "valence"];
    let allDiffsArray = [];
    let adArray = [], aeArray = [], avArray = [], deArray = [], dvArray = [], 
          evArray = [];

    features.audio_features.forEach((track) => {
        // from a to d. + means a is higher, - means a is lower
        const adDiff = track.acousticness - track.danceability;
        const aeDiff = track.acousticness - track.energy;
        const avDiff = track.acousticness - track.valence;
        const deDiff = track.danceability - track.energy;
        const dvDiff = track.danceability - track.valence;
        const evDiff = track.energy - track.valence;
        const diffObj = {"id": track.id, "ad": adDiff, "ae": aeDiff, "av": avDiff, "de": deDiff, 
        "dv": dvDiff, "ev": evDiff};
        adArray.push(adDiff);
        aeArray.push(aeDiff);
        avArray.push(avDiff);
        deArray.push(deDiff);
        dvArray.push(dvDiff);
        evArray.push(evDiff);
        allDiffsArray.push(adArray, aeArray, avArray, deArray, dvArray, evArray);
    });
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

    // make csv
    // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side \
    /*
    let csvContent = "";
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });*/
    //https://medium.com/@idorenyinudoh10/how-to-export-data-from-javascript-to-a-csv-file-955bdfc394a9 
    // does not destructively modify rows
    let csvContent = rows.map(row => row.join(",")).join("\n");
    //console.log(csvContent);

    // download csv
    //const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });    

    // source https://d3-graph-gallery.com/graph/correlogram_basic.html 
    //https://plnkr.co/edit/Va1Dw3hg2D5jPoNGKVWp?p=preview&preview
    // uses local csv data 
        // if (error) throw error
        // Going from wide to long format
    /*
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_correlogram.csv").then(function(rows) {
        // if (error) throw error
            // Going from wide to long format
            const data = [];
            console.log("theirs is: ", rows);

            rows.forEach(function(d) {
                let x = d[""];
                delete d[""];
                for (let prop in d) {
                    let y = prop,
                    value = d[prop];
                    data.push({
                    x: x,
                    y: y,
                    value: +value
                    });
                }
            });
    
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
                console.log("in their transform ", d);
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
    });*/

    // correlation matrix. source: https://d3-graph-gallery.com/graph/correlogram_basic.html 
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

    return (
        <>
            <div id="correlogram" className="bg-pink-500">
            </div>
        </>
    );
};

export default AnalyzeFeatures;
