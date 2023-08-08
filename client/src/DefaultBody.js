import React from 'react';
import { useSelector } from 'react-redux';
import AnalyzeFeatures from './AnalyzeFeatures';
import DisplayRecs from './DisplayRecs';

const DefaultBody = function() {
    const fetchState = useSelector((state) => state.globalStates.featuresValue);

    return (
        <>
            {fetchState ? <AnalyzeFeatures /> : null}
            <DisplayRecs />
        </>
    );
}

export default DefaultBody