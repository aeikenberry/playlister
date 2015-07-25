import async from 'async';
import Pitchfork from './pitchfork';
import Spotify from './spotify';

let pitchfork = new Pitchfork();
let spotify = new Spotify();

async.waterfall([
  (done) => {
    pitchfork.bestNewAlbums((titles) => {
      console.log('done with titles');
      done(null, titles);
    });
  },
  (titles, done) => {
    spotify.setAuth((api) => {
      done(null, titles, api);
    });
  },

  (titles, api, done) => {
    async.each(titles, (title, cb) => {
      api.searchTracks(`album:${title.album}`)
        .then((data) => {
          let tracks = [];
          data.body.tracks.items.forEach((track) => {
            console.log(track);
          });
          return api.addTracksToPlaylist(spotify.myUserId, playlist, tracks);
        })
        .then((data) => {
          cb();
        }, (err) => {
          console.log('error adding track to playlist', err);
          cb(err);
        })
    }, (err) => {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  }
], function(err) {
  if (err) console.log(err);
  console.log('finished.');
});
