import React from 'react';
import { useSelector } from 'react-redux';
import RunStatTestsOnTracks from './RunStatTestsOnTracks';
import DisplayRecs from './-DisplayRecs';

const DefaultBody = function() {
    const fetchState = useSelector((state) => state.globalStates.featuresValue);

    return (
        <>
            {fetchState ? <RunStatTestsOnTracks /> : null}
            <DisplayRecs />
        </>
    );
}

export default DefaultBody