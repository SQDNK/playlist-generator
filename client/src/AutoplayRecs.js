import React, { useEffect, useState } from 'react';
import { Player } from 'video-react';

const hello = function() {
    
}

const AutoplayRecs = function() { 
    const [tracksData, setTracksData] = useState(null);

    useEffect(() => {
        fetch("/recs")
        .then(res => res.json())
        .then(data => setTracksData(data))
    }, []);

    let previewItems = null;
    if (tracksData != null) {
        const tracksArray = tracksData.tracks;
        let artistsString = "";
        tracksArray.track.forEach((track) => {
            track.artists.forEach((artist) => {
                artistsString += `${artist.name} `;
            });
        });

        previewItems = tracksArray.map(track => 
            <li key={track.id}>
                <p>
                    {'title: ' + track.name + ' artists: ' + artistsString} 
                </p>
                <Player>
                    playsInline
                    src=`${track.preview_url}`;
                    autoPlay
                    loop
                    muted
                </Player>
            </li>)
    }
    return (
        <>
            {console.log("hello")}
            {
                tracksData && (
                    <ul>
                        {previewItems}
                    </ul>
                )
            }

        </>
    );
};

export default AutoplayRecs;