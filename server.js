// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + 'index.html');
});

// Initialize Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');
spotifyApi = new SpotifyWebApi();


//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//


app.post('/transfer', function (req, res) {
  spotifyApi.setAccessToken(req.query.token);
  
  // Transfer playback to specified device
  spotifyApi.transferMyPlayback({device_ids: [req.query.device_id]})
    .then(function(data) {
      res.sendStatus(200);
    }, function(err) {
    	console.error('transfer');
      console.error(err);
    });
});

app.post('/play', function (req, res) {
  spotifyApi.setAccessToken(req.query.token);
  
  // Play specified tracks
  spotifyApi.play({uris: req.query.uris.split(',')})
    .then(function(data) {
      res.sendStatus(200);
    }, function(err) {
      console.error(err);
    });
});

app.post('/pause', function (req, res) {
  spotifyApi.setAccessToken(req.query.token);
  spotifyApi.pause()
    .then(function(data) {
      res.sendStatus(200);
    }, function(err) {
      console.error(err);
    });
});

app.get('/audio-analysis', function (req, res) {
  spotifyApi.setAccessToken(req.query.token);
  spotifyApi.getAudioAnalysisForTrack(req.query.id)
    .then(function(data) {
	  res.send(JSON.stringify(data.body));
    }, function(err) {
      console.error(err);
    });
});


//------------------------ WEB SERVER -------------------------//

// Listen for requests to our app
// We make these requests from client.js
var listener = app.listen(59980, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

