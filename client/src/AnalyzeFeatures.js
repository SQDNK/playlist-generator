import React from 'react';
import { useSelector } from 'react-redux';

const ss = require('simple-statistics');
const d3 = require('d3');

const makeCorrelogram = function(...args) {
    for (const array in args) {

    }
    
}

const AnalyzeFeatures = function() {

    const features = useSelector((state) => state.features);

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

    features.value.audio_features.forEach((track) => {
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

    // correlation matrix. source: https://d3-graph-gallery.com/graph/correlogram_basic.html 
    // Graph dimension
    const margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 430 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom

    // Create the svg area
    const svg = d3.select("#correlogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // make array for csv 
    let rows = [["", "ad", "ae", "av", "de", "dv", "ev"]];
    for (let i = 0; i < allDiffsArray.length; i++) { 
        let row = [];
        row.push(rows[0][i+1]); // field name
        for (let j = 0; j < allDiffsArray.length; j++) {
            if (i == j) {
                row.push(1);
            } else { // **TODO: memoization here? 
                row.push(ss.sampleCorrelation(allDiffsArray[i], allDiffsArray[j]));
            }
        }
        rows.push(row);
    }

    // make csv
    // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side 
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    console.log(csvContent);

    // source https://d3-graph-gallery.com/graph/correlogram_basic.html 
    // uses local csv data 
    d3.csv(csvContent).then(function(rows) {
        // if (error) throw error
        // Going from wide to long format
        const data = [];
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

    })

    return (
        <div id="correlogram">
            
        </div>
    );
}

export default AnalyzeFeatures;
