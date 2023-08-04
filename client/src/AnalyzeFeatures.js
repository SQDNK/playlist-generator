import React from 'react';
import { useSelector } from 'react-redux';

const AnalyzeFeatures = function() {

    const features = useSelector((state) => state.features);
    console.log("features taken from store: " + features);

    return (
        <div>
            
        </div>
    );
}

export default AnalyzeFeatures;
