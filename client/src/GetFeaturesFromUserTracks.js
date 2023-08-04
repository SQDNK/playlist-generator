import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replace } from './featuresSlice';
import AnalyzeFeatures from './AnalyzeFeatures';
// **TODO: good design to import analyze features? or stick it here? 

const GetFeaturesFromUserTracks = function() {
    // params for calling api specifically get_recs  
    const [seedTracks, setSeedTracks] = useState("");
    const [seedGenres, setSeedGenres] = useState("");
    const [seedArtists, setSeedArtists] = useState("");
    const [showFeatures, setShowFeatures] = useState(false);

    //const [features, setFeatures] = useState({});

    const features = useSelector((state) => state.features.value);
    const dispatch = useDispatch();

    // https://react.dev/reference/react-dom/components/input
    const handleFormSubmit = async function(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // get token? 

        // Read the form data
        const form = e.target;
        //**TODO: formData being weird so not using for now */
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log("in client, form input is " + formData.get("seed_tracks"));

        // to get data, return res.json(). res => res.json() works.
        // res => {return res.json()} works. res => {res.json()} does not work. 
        await fetch("/get_features", { 
            method: form.method, 
            body: formData
            })
            .then(res => {
                return res.json();
                //setFeatures(res.data);
            })
            .then(data => {
                dispatch(change(data));

            })
            .catch(error => {
                console.log(error.message);
            });

        setShowFeatures(true);
    };

    return (
        <>
            <form method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                <label>
                    Track(s): 
                    {/*
                    
                    **TODO: make input box bigger 
                    
                    input is re-rendered on every edit by default. 
                        not sure its possible to change this. 
                        
                    temp: 2gNjmvuQiEd2z9SqyYi8HH,78MI7mu1LV1k4IA2HzKmHe
                    */ }
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

            {(showFeatures)
                ? <p></p>
                : <div>
                    <AnalyzeFeatures />
                </div>
            }
        </>
    );
};

export default GetFeaturesFromUserTracks;