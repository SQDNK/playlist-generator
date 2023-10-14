import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replace, replaceUserInput } from './redux/featuresSlice';
import AnalyzeFeatures from './RunStatTestsOnTracks';
import { setFeaturesState } from './redux/globalStatesSlice';
// **TODO: good design to import analyze features? or stick it here? 

// [NOTE] sends data to be statistically analyzed . 

const ParseUserInput = function() {
    // params for calling get_recs  
    const [seedTracks, setSeedTracks] = useState("");
    const [seedGenres, setSeedGenres] = useState("");
    const [seedArtists, setSeedArtists] = useState("");
    
    const [playlist, setPlaylist] = useState("");
    const [offset, setOffset] = useState("");

    //const [features, setFeatures] = useState({});

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
        //console.log("in client, form input is " + formData.get("seed_tracks"));

        // to get data, return res.json(). res => res.json() works.
        // res => {return res.json()} works. res => {res.json()} does not work. 

        // user wants to use tracks in playlist
        if (playlist != "") {
            await fetch("/get_ids_from_playlist", {
                method: form.method,
                body: formData })
                .then(res => res.json())
                .then(data => {
                    // append to formData and continue fetching below
                    // **TODO: will appending field "ids" be unsafe
                    // **TODO: currently ignores any seed_track inputs
                    let idsString = "";
                    data.items.forEach((item) => {
                        idsString += item.track.id + ",";
                    });
                    // remove last comma
                    idsString = idsString.substring(0,idsString.length-1);
                    formData.set("seed_tracks", idsString);
                })
                .catch(error => {
                    console.log(error.message);
                });
        }

        // places in redux to analyze features 
        await fetch("/get_features", { 
            method: form.method, 
            body: formData})
            .then(res => {
                return res.json();
                //setFeatures(res.data);
            })
            .then(data => {
                dispatch(replaceUserInput(data));
            })
            .catch(error => {
                console.log(error.message);
            });

        dispatch(setFeaturesState(true))
    };

    return (
        <div className="">
            <form method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit}
                  className="rounded-lg flex flex-row flex-wrap px-6 py-6 gap-4">
                <label className="bg-npink p-2 min-w-fit min-h-fit rounded-lg text-slate-900 dark:text-white basis-1/4 ">
                    Track(s): 
                    {/*
                    
                    **TODO: make input box bigger 
                    
                    input is re-rendered on every edit by defau76 h-16 
                        not sure its possible to change this. 
                        
                    temp: 2gNjmvuQiEd2z9SqyYi8HH,78MI7mu1LV1k4IA2HzKmHe
                    */ }
                    <input name="seed_tracks"
                           value={seedTracks} 
                           onChange={e => setSeedTracks(e.target.value)} /> 
                </label>
                <label className="bg-npink p-2 min-w-fit min-h-fit rounded-lg text-slate-900 dark:text-white basis-1/4">
                    Artists(s): 
                    <input name="seed_artists"
                           value={seedArtists} 
                           onChange={e => setSeedArtists(e.target.value)} /> 
                </label>
                <label className="bg-npink p-2 min-w-fit min-h-fit rounded-lg text-slate-900 dark:text-white basis-1/4">
                    Genres(s): 
                    {/*
                    
                    **TODO: list of valid genre strings 
                    */ }
                    <input name="seed_genres"
                           value={seedGenres} 
                           onChange={e => setSeedGenres(e.target.value)} /> 
                </label>
                <label className="bg-npink p-2 min-w-fit min-h-fit rounded-lg text-slate-900 dark:text-white basis-1/4">
                    Use tracks in playlist: 
                    Playlist ID:
                    <input name="playlist_id"
                           value={playlist} 
                           onChange={e => setPlaylist(e.target.value)} /> 
                    Offset (index of first track):
                    <input name="offset"
                           value={offset}
                           onChange={e => setOffset(e.target.value)} />
                </label>
                <button className="bg-nlime hover:bg-nlime rounded-lg p-2">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ParseUserInput;