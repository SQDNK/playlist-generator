import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

// react note: cannot put async function as react child 
const SendToServer = function() {
    //const showStatTests = useSelector((state) => (state.globalStates.statsValue));
    const statTestsResults = useSelector((state) => state.statTestsResults.value)

    const handleRequest = async function() {
        console.log(statTestsResults)
    
        // rename
        const sendJSON = JSON.stringify(statTestsResults);
        // rename to post recs?
        await fetch("/get_recs", { 
            method: "POST", 
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
