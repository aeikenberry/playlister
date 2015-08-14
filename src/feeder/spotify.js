import _ from 'lodash';
import async from 'async';
import dotenv from 'dotenv';
import request from 'request-promise';
import Feed from '../models/Feed';

dotenv.load();


export default class Spotify {

  constructor() {
    this.userId = process.env.USER_ID;
    this.refresh_token = process.env.REFRESH_TOKEN;
    this.client_id = '8eefcfde253e44b79a9f778daf9513d1';
    this.client_secret = process.env.CLIENT_SECRET;
    this.redirect_uri = 'http://localhost:8000/app/';
  }

  getToken(cb) {
    console.log(this.refresh_token, this.redirect_uri);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: this.refresh_token,
        redirect_uri: this.redirect_uri,
        grant_type: 'refresh_token'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(this.client_id + ':' + this.client_secret).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, (error, response, body) => {
      this.access_token = body.access_token;
      cb(body.access_token);
    });
  }

  addTracksToFeed(feed, token, cb) {
    async.waterfall([
      done => {
        this.getTrackUrisForFeed(feed, done);
      },
      (feedObj, uris, done) => {
        this.getPlaylistTracks(feedObj, uris, done);
      },
      (uris, playlistTracks, done) => {
        this._addTracksToFeed(feed, uris, playlistTracks, done);
      }
    ], err => {
      if (err) {
        console.log(err);
        return cb(err);
      }

      cb();
    });
  }

  getTrackUrisForFeed(f, cb) {
    Feed.findOne({ name: f.name }, (err, found) => {
      if (err) return cb(err);

      let trackUris = found.tracks.map(t => {
        return t.uri;
      });

      cb(null, found, trackUris);
    });
  }

  getPlaylistTracks(feed, uris, cb, offset, tracks) {
    var tracks = tracks || [];
    var offset = offset || 0;

    let auth = {
      url: `https://api.spotify.com/v1/users/${this.userId}/playlists/${feed.playlistId}/tracks?offset=${offset}`,
      headers: {
        'Authorization': 'Bearer ' + this.access_token
      },
      resolveWithFullResponse: true
    };


    request.get(auth).then(data =>  {
      let body = JSON.parse(data.body);
      if (body.items.length) {
        tracks = tracks.concat(body.items);
        offset += 100;
        this.getPlaylistTracks(feed, uris, cb, offset, tracks);
      } else {
        cb(null, uris, tracks);
      }
    });
  }

  _addTracksToFeed(feed, uris, playlistTracks, cb) {
    let CHUNK_SIZE = 100;
    let playlistUris = playlistTracks.map(t => { return t.track.uri });
    let urisToAdd = uris.filter(uri => {
      return _.indexOf(playlistUris, uri) == -1;
    });

    if (!urisToAdd.length) {
      console.log('Nothing new to add to ' + feed.name);
      return cb();
    }

    console.log('Adding ' + urisToAdd.length + ' to '+ feed.name);


    var batches = [];

    while (urisToAdd.length) {
        var batch = urisToAdd.splice(0, CHUNK_SIZE);
        batches.push(batch);
    }

    async.eachSeries(batches, (batch, done) => {
      let queryString = '?uris=';

      batch.forEach(uri => {
        queryString += uri + ','
      });

      let deets = {
        url: `https://api.spotify.com/v1/users/${this.userId}/playlists/${feed.playlistId}/tracks${queryString}`,
        headers: {
          'Authorization': 'Bearer ' + this.access_token
        }
      };

      request.post(deets, (error, response, body) => {
        console.log(body);
        if (error) {
          console.log(error);
          return done(error);
        }
        done();
      });
    }, err => {
      if (err) {
        console.log(err);
        return cb(err);
      }

      cb();
    });
  }

}
