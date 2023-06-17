import React, { useEffect, useState } from 'react';

export const Checkbox = ({ isChecked, label, checkHandler, index }) => {
    return (
      <div>
        <input
          type="checkbox"
          id={`checkbox-${index}`}
          checked={isChecked}
          onChange={checkHandler}
        />
        <label htmlFor={`checkbox-${index}`}>{label}</label>
      </div>
    )
}

// checkboxes for multiple elements: https://dev.to/collegewap/how-to-work-with-checkboxes-in-react-44bc
const DisplayRecs = function() { 
    const [recsCheckbox, setRecsCheckbox] = useState([]);

    const fetchDataFromExpress = async function() {
        await fetch("/recs")
            .then(res => res.json())
            .then(data => {
                //setTracksData(data);
                let recsCheckboxArray = [];
                data.tracks.forEach((track) => {
                    let artistsString = "";
                    track.artists.forEach((artist) => {
                        artistsString += artist.name;
                    });
                    recsCheckboxArray.push(
                        {id: track.id, 
                         name: track.name,
                         artists: artistsString,
                         preview_url: track.preview_url,
                         uri: track.uri,
                         isChecked: false});
                });
                setRecsCheckbox(recsCheckboxArray);
            });
    };
/*
    useEffect(() => {
        if (tracksData != null) {
            //prepCheckbox();
            let recsCheckboxArray = [];
            tracksData.tracks.forEach((track) => {
                recsCheckboxArray.push({track, isChecked: false});
            });
            setRecsCheckbox(recsCheckboxArray);
        }
    }, [tracksData]); // create checkbox when tracksData is set*/

    const updateIsChecked = function(index) {
        setRecsCheckbox(
            recsCheckbox.map((rec, currIndex) =>
                currIndex === index 
                ? { ...rec, isChecked: !rec.isChecked }
                : rec
            )
        );
    };

    const addToPlaylist = function() {
        let uriArray = [];
        recsCheckbox.forEach((rec) => {
            if (rec.isChecked) {
                uriArray.push(rec.uri);
            }
        });

        let posValue = 0;
    }

    return (
        <>
            <button onClick={fetchDataFromExpress}>
                Get Recs
            </button>
            {(recsCheckbox != []) && (
                recsCheckbox.length === 0 // **TODO: when will we have no results? 
                ? <p>No Results</p>
                : <ul>
                    <div>
                        {recsCheckbox.map((track, index) => (
                            <div key={track.id}>
                                <Checkbox
                                    key={track.name + ' ' + `${index}`}
                                    isChecked={track.isChecked}
                                    checkHandler={() => updateIsChecked(index)}
                                    label={track.name + ' -- ' + track.artists}
                                    index={index}>
                                </Checkbox>
                                <iframe 
                                    id={"preview"+track.id}
                                    src={track.preview_url}
                                    title={"preview of " + track.id}
                                    width="400"
                                    height="150">

                                </iframe>
                            </div>
                        ))}
                    </div>
                    <button onClick={addToPlaylist}>
                        Add to playlist 
                    </button>
                  </ul>
            )}

        </>
    );
};

export default DisplayRecs;