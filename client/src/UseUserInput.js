import React, { useEffect, useState } from 'react';

const UseUserInput = function() {
    // params for calling api specifically get_recs  
    const [seedTracks, setSeedTracks] = useState("");
    const [seedGenres, setSeedGenres] = useState("");
    const [seedArtists, setSeedArtists] = useState("");

    const [features, setFeatures] = useState(null);

    // https://react.dev/reference/react-dom/components/input
    const handleFormSubmit = async function(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        //**TODO: formData being weird so not using for now */
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log("form object? " + formJson.seed_tracks);

        await fetch("/get_seed_tracks_features", { 
            method: form.method, 
            body: JSON.stringify(formJson)
            })
            .then(res => {
                res.json();
                //setFeatures(res.data);
            })
            .then(data => {
                console.log("data " + data);
                let featuresArray = [];
                data.audio_features.forEach((track) => {
                    track.forEach((feature) => {
                        featuresArray.push(feature);
                    });
                });
                //setFeatures(featuresArray);
                console.log(featuresArray);
            });
        ;

    };

    return (
        <>
            <form method="POST" onSubmit={handleFormSubmit}>
                <label>
                    Track(s): 
                    {/*
                    
                    **TODO: make input box bigger 
                    
                    input is re-rendered on every edit by default. 
                        not sure its possible to change this. */ }
                    <input name="seed_tracks"
                           value={seedTracks} 
                           onChange={e => setSeedTracks(e.target.value)} /> 
                </label>
                <label>
                    Artists(s): 
                    <input name="seed_artists"
                           value={seedArtists} 
                           onChange={e => setSeedArtists(e.target.value)} /> 
                </label>
                <label>
                    Genres(s): 
                    {/*
                    
                    **TODO: list of valid genre strings 
                    */ }
                    <input name="seed_genres"
                           value={seedGenres} 
                           onChange={e => setSeedGenres(e.target.value)} /> 
                </label>
                <button>
                    Submit
                </button>
            </form>

            {(features !== [])
                ? <p></p>
                : <div>
                    {features.map((feature) => (
                        <div key={`${feature}`}>
                            hello
                        </div>
                    ))}
                </div>
            }
        </>
    );
};

export default UseUserInput;