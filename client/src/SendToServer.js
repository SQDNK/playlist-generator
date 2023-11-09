import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
//import RunStatTestsOnTracks from './RunStatTestsOnTracks';
import { replaceStatTestResults } from './redux/statTestsResultsSlice';
import { setStatsState } from './redux/globalStatesSlice';

const ss = require('simple-statistics');

const RunStatTestsOnTracks = function() {
    const features = useSelector((state) => state.features.value);

    /* is one combination of feature values similar to another? 
    = is say a .1 difference between the same feature value of one song versus
    another song significant? 
    how similar is one song to another? 
    */
    // measure relative differences between feature values of a song
    //const includedFeats = ["acousticness", "danceability", "energy", "valence"];

    // make data
    let distancesObj = {};
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

        distancesObj["ad"] = adArray;
        distancesObj["ae"] = aeArray;
        distancesObj["av"] = avArray;
        distancesObj["de"] = deArray;
        distancesObj["dv"] = dvArray;
        distancesObj["ev"] = evArray;
        /*
        **TODO: modulate it?
        for (let field of fieldsArray) {
            obj[field] = track.${field};
        }*/
    })

    /* to find if any tracks have similar differences, check if any mean difference
    // is significant (?). use hypothesized mean of 0. 
    // should we compare means against each other?
    // each difference will tell you if the two features are dependent. looking at
    all diffs at once will tell you if the diffs are dependent. 
    */

    // -------- try single case 
    let correlationsObj = {}
    correlationsObj["ad ae"] = ss.sampleCorrelation(distancesObj["ad"], distancesObj["ae"]).toFixed(4) 
    
    // -------- determine significance
    // make array for csv 
    
    let fieldNames = ["ad", "ae", "av", "de", "dv", "ev"];
    /*
    // make csvContent without d3 for now (issue becoming difficult)
    //let csvContentTemp = [];
    for (let i = 0; i < fieldNames.length; i++) { // i < num of fields
        let row = [];
        let rowTempObj = {};
        row.push(fieldNames[i]); // field name
        for (let j = 0; j < fieldNames.length; j++) {
            if (i === j) {
                row.push(1); // sampleCorrelation doesn't return exactly 1
                //rowTempObj[fields[j]] = 1;
            } else {
                row.push(ss.sampleCorrelation(distancesObj[i], distancesObj[j]));
                //rowTempObj[correlationsObj[0][j]] = ss.sampleCorrelation(distancesObj[i], distancesObj[j]);
            }
        }
        correlationsObj.push(row);
        //csvContentTemp.push(rowTempObj); 
    }*/

    // -------- send to redux after determining significance
    // send min, max, target 
    // rename bc confusing
    let minTargetMaxObj = {};
    let q1 = ss.quantile(distancesObj["ad"],.25);
    let median = ss.quantile(distancesObj["ad"],.5);
    let q3 = ss.quantile(distancesObj["ad"],.75);
    minTargetMaxObj["ad"] = [q1, q3, median];
    // **dispatch code may be important
    /*
    const dispatch = useDispatch();
    dispatch(replaceStatTestResults(minTargetMaxObj));
    //console.log("replaced? ", useSelector((state) => state.statTestsResults.value));
    dispatch(setStatsState(true)); */

    // format for api calling
    let formatted = {};
    


    return minTargetMaxObj;
};

const SendToServer = function() {
    
    //const showStatTests = useSelector((state) => (state.globalStates.statsValue));
    //const statTestsResults = useSelector((state) => state.statTestsResults.value)
    const statTestsResults = RunStatTestsOnTracks();

    const handleRequest = async function() {
    
        // rename
        const sendJSON = JSON.stringify(statTestsResults);
        // formatted as: {"ad": [q1, q3, median]}
        // rename to post recs?
        await fetch("/get_recs", { 
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: sendJSON})
            .then(res => {
                return res.json();
            })
            .then(data => {
                //dispatch(replaceUserInput(data));
            })
            .catch(error => {
                console.log(error.message);
            });

        //dispatch(setFeaturesState(true))
    };

    return (
        <div className="">
            <button className = "bg-nlime hover:bg-nlime rounded-lg p-2" onClick={handleRequest}>
                click after running stat tests
            </button>
        </div>
    );
}

export default SendToServer;
