// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

let _token = hash.access_token;
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '{ SPOTIFY CLIENTID }';
const redirectUri = 'localhost:59980';
const scopes = ['streaming', 'user-modify-playback-state', 'user-read-birthdate', 'user-read-email', 'user-read-private'];

// If there is no token, redirect to Spotify authorization
if (!_token) {
	window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=http://${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
}

// Initialise the Web Playback SDK

let player, deviceId;

window.onSpotifyWebPlaybackSDKReady = function () {
  var accessToken = _token;
  player = new Spotify.Player({
    name: 'Junction',
    getOAuthToken: function (callback) { callback(accessToken); }
  });

  // Error handling
  player.on('initialization_error', function (e) { console.log('Initialization Error', e); });
  player.on('authentication_error', function (e) { console.log('Authentication Error', e); });
  player.on('account_error', function (e) { console.log('Account Error', e); });
  player.on('playback_error', function (e) { console.log('Playback Error', e); });

  // Playback status updates
  player.on('player_state_changed', function (e) {
    //console.log("Player state changed", e);
    updateCurrentTrack(e.track_window.current_track)
  });

  // Ready
  player.on('ready', function (data) {
    transferPlayback(data.device_id);
  });

  // Connect to the player!
  player.connect();
}

// Make a call using the token

function transferPlayback(deviceId) {
  $.post('transfer?device_id=' + deviceId + '&token=' + _token)
    .then(function() {
      let alert = $('<div class="alert alert-success" role="alert">Sweet! You\'re now listening on ' + player._options.name + '</div>');
      alert.appendTo('#alert');
    });
}

function togglePlay() {
  player.togglePlay();
}

function play(number) {
	number = number;
	if (number == 1){
		let uris = 'spotify:track:4pdPtRcBmOSQDlJ3Fk945m';
		let tid = uris.split(":");
		$.post('/play?uris=' + uris + '&token=' + _token);
		analyze(tid[2]);
		$(".oun-incoming").css({ "display": "block" });
	}else if (number == 2){
		let uris = 'spotify:track:5MF6TziWA9nhyMKXBMgm2o';
		let tid = uris.split(":");
		$.post('/play?uris=' + uris + '&token=' + _token);
		analyze(tid[2]);
		$(".oun-incoming").css({ "display": "block" });
	}else if (number == 3){
		let uris = 'spotify:track:5h5tBFnbcVioFXiOixTn6E';
		let tid = uris.split(":");
		$.post('/play?uris=' + uris + '&token=' + _token);
		analyze(tid[2]);
		$(".oun-incoming").css({ "display": "block" });
	}else if (number == 4){
		let uris = 'spotify:track:1vfx68bEuJpOLgHlnyYRht';
		let tid = uris.split(":");
		$.post('/play?uris=' + uris + '&token=' + _token);
		analyze(tid[2]);
		$(".oun-incoming").css({ "display": "block" });
	}

}

function pause() {
  $.post('/pause?' + '&token=' + _token);
}

function getCurrentSegment() {
	let data = window.trackAnalysis;

	player.getCurrentState().then((state) => {
		if (state === null) {
			return;
		}

		let position = state.position / 1000;
		let segments_total = data.segments.map((segment) => segment.timbre[3]).reduce((accumulator, currentValue) => accumulator + currentValue);

		let segments = data.segments.map((segment) => {
			return jQuery.extend(segment, {
				percentage: (segment.timbre[3] / segments_total) * 100,
				end: (segment.start + segment.duration)
			})
		});

		segments.forEach((segment) => {
			if (position > segment.start && position < segment.end) {
				$(".lion-head").css({ "background-size": 70 + segment.percentage * 10 + "% auto" });
			}
		})
	});
}

function analyze(trackid) {
	$.getJSON('/audio-analysis?id=' + trackid + '&token=' + _token, (data) => {
		window.trackAnalysis = data;

		getCurrentSegment();
		setInterval(() => {
			getCurrentSegment();
		}, 50);
	});
}

function updateCurrentTrack(track) {
  $('#current-track').empty();
  let name = $('<h2>' + track.name + '</h2>');
  name.appendTo('#current-track');
}
