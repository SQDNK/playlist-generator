import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const SendToServer = async function() {
    const statTestsResults = useSelector((state) => state.statTestsResults.value)
    console.log(statTestsResults)

    sendData = {}

    // rename
    sendJSON = JSON.stringify(sendData);

    await fetch("/get_features", { 
        method: POST, 
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

    return (
        <div className="">

        </div>
    );
}

export default SendToServer;
