/**
 * Skeleton source: https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
 * fetch (node-fetch): https://www.npmjs.com/package/node-fetch 
 */
// mod.cjs; same as 'import fetch from 'node-fetch''
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let express = require('express'); // Express web server framework
// **TODO optional: what do these do
let cors = require('cors');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
const port = 8888 // both express and react app default to 3000 

let client_id = '62897c9c82b2443888d1e7b2dc9d03e7'; // Your client id
let client_secret = 'da37bbe76aaf403386c0b1e0c032371c'; // Your secret
let redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

let globalToken = null;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = 'spotify_auth_state';

let app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  let scope = 'user-read-private user-read-email playlist-modify-public \
               playlist-modify-private playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// maybe export 
const fetchAndCatchError = async function(res, url, fetchParamsObj) {
  try {
    const response = await fetch(url, fetchParamsObj);
    if (response.status != 200) { // an ok response has response.status >= 200 && response.status < 300
      // this is not always an error response. e.g. add recs results in snapshot-id 
      console.log(`HTTP Error Response: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);

    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);

    res.redirect('/#' +
    querystring.stringify({
      error: 'invalid_token'
    }));
  }
}

app.get('/callback', async function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    // **TODO: why put authoptions here? 
    /*
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true */
    };

    // --- its own function probably 
    let formParams = new URLSearchParams();
    formParams.append('code', code);
    formParams.append('redirect_uri', redirect_uri);
    formParams.append('grant_type', 'authorization_code');
    
    let url = 'https://accounts.spotify.com/api/token';
    let fetchParamsObj = {method: 'POST',
                          body: formParams,
                          headers: {'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))},
                          json: true};
    const data = await fetchAndCatchError(res, url, fetchParamsObj);
    // should have no error here
    console.log(data);
    let access_token = data.access_token, refresh_token = data.refresh_token;
    globalToken = access_token;

    /*
    // use the access token to access the Spotify Web API
    let urlG = 'https://api.spotify.com/v1/me';
    let fetchParamsObjG = {method: 'GET',
                           headers: {'Authorization': 'Bearer ' + access_token},
                           json: true};
    const dataG = await fetchAndCatchError(res, urlG, fetchParamsObjG); 
    // should have no error here
    console.log(dataG);*/



    // we can also pass the token to the browser to make requests from there
    res.redirect('/#' +
    querystring.stringify({
      access_token: access_token,
      refresh_token: refresh_token
    }));
  });

app.get('/recs', async function(req, res) {
  // **TODO: this was in the beginning of app.get /callback so placed it here too (?)
  /* what does it actually do? 
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey); 
    // **TODO: why put authoptions here? 
    /*
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true 
  }; */

  let playlist_id = '3BHHjHO7e1rV2yzCs54bnV';

  // use (all) tracks in playlist as seed tracks to get recs
  let urlT = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  let fetchParamsObjT = {method: 'GET',
                          headers: {'Authorization': 'Bearer ' + globalToken},
                          json: true};
  const dataT = await fetchAndCatchError(res, urlT, fetchParamsObjT);
  let seedTracksString = "";
  let count = 0; 
  // adds the first 5 tracks of playlist since spotify's seed limit is 5.
  for(const trackItem of dataT.items) {
    seedTracksString += `${trackItem.track.id},`;
    count++;
    if (count >= 5) {
      break;
    }
  };   
  // remove last comma
  seedTracksString = seedTracksString.slice(0, seedTracksString.length-1);

  // have the option of fine tuning recs from seeds
  // **TODO: without seeds? 
  // **TODO: show audio features to user
  
  // **TODO: currently uses string with limit of 5 tracks. allow users to put
  // in more
  let paramsF = new URLSearchParams();
  paramsF.append("ids", seedTracksString);
  let urlF = `https://api.spotify.com/v1/audio-features?${paramsF.toString()}`;
  let fetchParamsObjF = {method: 'GET',
                          headers: {'Authorization': 'Bearer ' + globalToken},
                          json: true};
  const dataF = await fetchAndCatchError(res, urlF, fetchParamsObjF);  
  
  let featureMap = new Map([["acousticness", 0], ["danceability",0], 
    ["energy", 0], ["loudness", 0],["speechiness", 0], ["tempo", 0], ["valence", 0]]); 
  const numOfTracks = dataF.audio_features.length;
  for (const track of dataF.audio_features) {
    for (const [key, value] of featureMap) {
      // to find best recs, average the params (is this the best way?)
      // dynamically update avg by doing (avg * length + newElem) / length
      featureMap.set(key, (value*numOfTracks + track[key]) / numOfTracks  );
    }
  }

  // call spotify web api to get recs
  let paramsR = new URLSearchParams();
  paramsR.append("limit", 2);
  paramsR.append("seed_tracks", seedTracksString);
  for (const [key, value] of featureMap) {
    paramsR.append("target_"+key, value);
  }

  // **TODO: what if there are no seeds and only params for fine tuning?
  // **TODO: fine tuning will repeat tracks
  /*
  choose features that can be input to rec api and output from track feature api
  also lets you use more than 5 tracks
  url for full audio analysis possible 
  min, max, target acousticness (maybe just target?)
  danceability
  energy
  instrumentalness (excluded for now)
  key (excluded for now)
  liveness (excluded)
  loudness
  mode (excluded for now) (major or minor = 1 or 0)
  speechiness (excluded if only finding recs for tracks)
  tempo
  time_signature
  valence (musical positiveness) 
  /*
  let seedArtists = document.getElementById("seed-artists").value; 
  let seedGenres = document.getElementById("seed-genres").value;
  let seedTracks = document.getElementById("seed-tracks").value;
  if (seedArtists != "") {
      paramsR.append("seed_artists", seedArtists);
  }
  if (seedGenres != "") {
      paramsR.append("seed_genres", seedGenres);
  }
  if (seedTracks != "") {
      paramsR.append("seed_tracks", seedTracks);
  }*/

  let urlR = `https://api.spotify.com/v1/recommendations?${paramsR.toString()}`;
  let fetchParamsObjR = {method: 'GET',
                          headers: {'Authorization': 'Bearer ' + globalToken},
                          json: true};
  const dataR = await fetchAndCatchError(res, urlR, fetchParamsObjR);    
  
  // add recs to designated playlist
  let uriArray = [];
  let posValue = 0;
  dataR.tracks.forEach((track) => {
    uriArray.push(`${track.uri}`);
  });
  let bodyA = {"uris": uriArray, "position": posValue};
  let urlA = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  let fetchParamsObjA = {method: 'POST',
                          headers: {'Authorization': 'Bearer ' + globalToken, 
                                    'Content-Type': 'application/json'},
                          body: JSON.stringify(bodyA),
                          json: true};
  const dataA = await fetchAndCatchError(res, urlA, fetchParamsObjA);
  console.log(dataA);

  // for frontend
  res.json(dataR);
});

app.get('/refresh_token', async function(req, res) {

  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;

  let formParams = new URLSearchParams();
  formParams.append('grant_type', 'refresh_token');
  formParams.append('refresh_token', refresh_token);

  let urlP = 'https://accounts.spotify.com/api/token';
  let fetchParamsObjP = {method: 'POST',
                         body: formParams,
                         headers: {'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))},
                         json: true};
  const dataP = await fetchAndCatchError(res, urlP, fetchParamsObjP);

  // should have no error here
  let access_token = dataP.access_token;
  globalToken = access_token;
  res.send({
    'access_token': access_token
  });
});

app.listen(port, () => {
  console.log(`Playlist-generator listening at http://localhost:${port}`)
})