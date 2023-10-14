import React, { useEffect, useState } from 'react';

const RefineRecs = function() {
    const [ids, setIds] = useState("");
    
    const fetchExpress = async function() {
        await fetch("/refine", {
            method: "POST",
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify({ids: ids})
            })
            .then(res => res.json())
            .then(data => {
                data.audio_features.forEach((track) => {
                    console.log(track.track_href)
                })
            })
    }

    return (
        <>
            <button onClick={fetchExpress}>
                Refine Recs
            </button>
        </>
    )
}

export default RefineRecs;