/**
 * Skeleton source: https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
 * fetch (node-fetch): https://www.npmjs.com/package/node-fetch 
 */
// mod.cjs; same as 'import fetch from 'node-fetch''
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let express = require('express'); // Express web server framework
let app = express();
// **TODO optional: what does cookie parser do 
let cors = require('cors');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
let multer = require('multer');
let upload = multer();
const port = 8888 // both express and react app default to 3000 

let client_id = '62897c9c82b2443888d1e7b2dc9d03e7'; // Your client id
let client_secret = 'da37bbe76aaf403386c0b1e0c032371c'; // Your secret
let redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

//**TODO: use body parser? */

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

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(express.json()) // for parsing application/json
   .use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add headers before the routes are defined


// for modularity, use express.router

// maybe export 
const fetchAndCatchError = async function(res, url, fetchParamsObj) {
  let response;
  try {
    response = await fetch(url, fetchParamsObj);
    if (response.status != 200) { // an ok response has response.status >= 200 && response.status < 300
      // this is not always an error response. add recs results in snapshot-id 
      console.log(`HTTP Error Response: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);

    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);

    res.redirect('/#' +
    querystring.stringify({
      error: 'invalid_token'
    }));
  }
  return await response.json();
}

app.get('/get_token', async function(req, res) {

  let formParams = new URLSearchParams();
  formParams.append('grant_type', "client_credentials");
  formParams.append('client_id', client_id);
  formParams.append('client_secret', client_secret);
  
  let url = 'https://accounts.spotify.com/api/token';
  let fetchParamsObj = {method: 'POST',
                        body: formParams,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        json: true};

  console.log("in express, before fetching token");
  const data = await fetchAndCatchError(res, url, fetchParamsObj);
  // should have no error at this point
  console.log("in express, after fetching token: " + data.access_token);
  res.cookie('token', data.access_token, { httpOnly: true })
          .sendStatus(200); // frontend will retrieve token from cookies
  //res.json(data);
});

app.get('/login', function(req, res) {

  console.log('Request Type at /login:', req.method)
  console.log("hello from /login");
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

app.get('/callback', async function(req, res) {

  console.log("called get /callback");
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
    // should have no error at this point
    console.log(data);
    let access_token = data.access_token, refresh_token = data.refresh_token;
    res.cookie('token', access_token, { httpOnly: true })
            .sendStatus(200); // frontend will retrieve token from cookies

    /*
    // use the access token to access the Spotify Web API
    let urlG = 'https://api.spotify.com/v1/me';
    let fetchParamsObjG = {method: 'GET',
                           headers: {'Authorization': 'Bearer ' + access_token},
                           json: true};
    const dataG = await fetchAndCatchError(res, urlG, fetchParamsObjG); 
    // should have no error here
    console.log(dataG);*/


    /*
    // we can also pass the token to the browser to make requests from there
    res.redirect('/#' +
    querystring.stringify({
      access_token: access_token,
      refresh_token: refresh_token
    }));*/
  });

app.post('/get_ids_from_playlist', upload.none(), async function(req, res) {
  let paramsO = new URLSearchParams();
  if (req.body.offset === "") {
    paramsO.append("offset", 0);
  } else {
    paramsO.append("offset", req.body.offset);
  }
  let url = `https://api.spotify.com/v1/playlists/${req.body.playlist_id}/tracks?${paramsO.toString()}&limit=50`;
  let fetchParamsObj = {method: 'GET',
                        headers: {'Authorization': 'Bearer ' + req.cookies.token},
                        json: true};
  const track_ids = await fetchAndCatchError(res, url, fetchParamsObj);
  res.jsonp(track_ids);
});

app.post('/get_features', upload.none(), async function(req, res) {
  // get features from api
  let params = new URLSearchParams();
  params.append("ids", req.body.seed_tracks);
  let url = `https://api.spotify.com/v1/audio-features?${params.toString()}`;
  let fetchParamsObj = {method: 'GET',
                        headers: {'Authorization': 'Bearer ' + req.cookies.token},
                        json: true};
  const data_features = await fetchAndCatchError(res, url, fetchParamsObj);
  //console.log(data);
  res.jsonp(data_features);

  /*
  let playlist_id = '7j5iIX8wkn23t2qB91vf5U';

  // use (all) tracks in playlist as seed tracks to get recs
  let urlT = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  let fetchParamsObjT = {method: 'GET',
                          headers: {'Authorization': 'Bearer ' + req.cookies.token},
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
                          headers: {'Authorization': 'Bearer ' + req.cookies.token},
                          json: true};
  const dataF = await fetchAndCatchError(res, urlF, fetchParamsObjF);  
  // send to frontend
  res.json(dataF);*/
});

app.get('/get_recs', async function(req, res) {
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
  
  let featureMap = new Map([["danceability",0], 
    ["energy", 0], ["valence", 0]]); 
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
  paramsR.append("limit", 50);
  paramsR.append("seed_tracks", seedTracksString);
  for (const [key, value] of featureMap) {
    paramsR.append("target_"+key, value);
  }

  // **TODO: what if there are no seeds and only params for fine tuning?
  // **TODO: fine tuning will repeat tracks
  /*
  choose features that can be input to rec api and output from track feature api
  also lets you use more than 5 tracks
  min, max of each feature? maybe just target? 
  acousticness
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
                          headers: {'Authorization': 'Bearer ' + req.cookies.token},
                          json: true};
  const dataR = await fetchAndCatchError(res, urlR, fetchParamsObjR);    

  // for frontend
  res.json(dataR);
});

app.post('/add_recs', async function(req, res) {

  // add recs to designated playlist
  //**TODO do something about repeated tracks 
  let urlA = `https://api.spotify.com/v1/playlists/${req.body.playlistId}/tracks`;
  let fetchParamsObjA = {method: 'POST',
                          headers: {'Authorization': 'Bearer ' + req.cookies.token, 
                                    'Content-Type': 'application/json'},
                          body: JSON.stringify({"uris": req.body.uriArray, 
                                                "position": req.body.posValue}),
                          json: true};
  const dataA = await fetchAndCatchError(res, urlA, fetchParamsObjA);
  res.json(dataA);
  // TODO: how to confirm done to user 
});

app.post('/refine', async function(req, res) {
  // look at full details of tracks. 
  // refine algorithm: choose most similar features and get recs based on that?

  let ids = req.body.ids;
  let url = `https://api.spotify.com/v1/audio-features?${ids}`;
  let fetchParamsObj = {method: 'GET',
                          headers: {'Authorization': 'Bearer ' + req.cookies.token},
                          json: true};
  const data = await fetchAndCatchError(res, url, fetchParamsObj);
  res.json(data);

})

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
  res.send({
    'access_token': access_token
  });
});

app.listen(port, () => {
  console.log(`Playlist-generator listening at http://localhost:${port}`)
})