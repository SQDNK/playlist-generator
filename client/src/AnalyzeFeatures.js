import React from 'react';
import { useSelector } from 'react-redux';

const AnalyzeFeatures = function() {

    const features = useSelector((state) => state.features);
    console.log("features taken from store: " + features);

    /* is one combination of feature values similar to another? 
    = is say a .1 difference between the same feature value of one song versus
    another song significant? 
    how similar is one song to another? 
    */
    // measure relative differences between feature values of a song
    //const includedFeats = ["acousticness", "danceability", "energy", "valence"];
    const allDiffsArray = [];
    features.audio_features.forEach((track) => {
        // from a to d. + means a is higher, - means a is lower
        adDiff = track.acousticness - track.danceability;
        aeDiff = track.acousticness - track.energy;
        avDiff = track.acousticness - track.valence;
        deDiff = track.danceability - track.energy;
        dvDiff = track.danceability - track.valence;
        evDiff = track.energy - track.valence;
        const diffObj = {"id": track.id, "ad": adDiff, "ae": aeDiff, "av": avDiff, "de": deDiff, 
        "dv": dvDiff, "ev": evDiff};
        allDiffsArray.append(diffObj);
    });
    /* to find if any tracks have similar differences, check if any mean difference
    // is significant (?). use hypothesized mean of 0. 
    // should we compare means against each other?
    // each difference will tell you if the two features are dependent. looking at
    all diffs at once will tell you if the diffs are dependent. 
    */

    return (
        <div>

        </div>
    );
}

export default AnalyzeFeatures;
