import React from 'react';
import { useSelector } from 'react-redux';
import RunStatTestsOnTracks from './RunStatTestsOnTracks';
import DisplayRecs from './-DisplayRecs';
import SendToServer from './SendToServer';

const DefaultBody = function() {
    const showFeatures = useSelector((state) => state.globalStates.featuresValue);
    const showStatTests = useSelector((state) => (state.globalStates.statsValue));

    return (
        <>
            {showFeatures ? <RunStatTestsOnTracks /> : null}
            {showStatTests ? <SendToServer /> : null}
            <DisplayRecs />
        </>
    );
}

export default DefaultBody