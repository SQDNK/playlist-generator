import React from 'react';
import { useSelector } from 'react-redux';
import RunStatTestsOnTracks from './RunStatTestsOnTracks';
import DisplayRecs from './-DisplayRecs';
import SendToServer from './SendToServer';

const ReduxDependentLayout = function() {
    const showFeatures = useSelector((state) => state.globalStates.featuresValue);
    const showStatTests = useSelector((state) => (state.globalStates.statsValue));

    //showFeatures ? <RunStatTestsOnTracks /> : null

    return (
        <>
            {showStatTests ? <SendToServer /> : null}
            <DisplayRecs />
            
        </>
    );
}

export default ReduxDependentLayout;