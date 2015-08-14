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
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: this.refresh_token,
        redirect_uri: this.redirect_uri,
        grant_type: 'authorization_code'
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
        this.getTrackUrisForFeed(token, feed, done);
      },
      (feedObj, uris, done) => {
        this.getPlaylistTracks(token, feedObj, uris, done);
      },
      (feed, uris, playlistTracks, done) => {
        this._addTracksToFeed(token, feed, uris, playlistTracks, done);
      }
    ], err => {
      if (err) console.log(err);
    });
  }

  getTrackUrisForFeed(token, f, cb) {
    Feed.findOne({ name: f.name }, (err, found) => {
      if (err) return cb(err);

      let trackUris = found.tracks.map(t => {
        return t.uri;
      });

      cb(null, found, trackUris);
    });
  }

  getPlaylistTracks(token, feed, uris, cb) {
    let auth = {
      url: `https://api.spotify.com/v1/users/${this.userId}/playlists/${feed.playlistId}/tracks`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    request.get(auth, (error, response, body) => {
      cb(null, feed, uris, body.items);
    });
  }

  _addTracksToFeed(token, feed, uris, playlistTracks, cb) {
    let playlistUris = playlistTracks.map(t => { return t.uri });
    let urisToAdd = uris.filter(uri => {
      return _.indexOf(playlistUris, uri) > -1;
    });

    let deets = {
      url: `https://api.spotify.com/v1/users/${this.userId}/playlists/${feed.playlistId}/tracks`,
      json: true,
      form: {
        uris: urisToAdd
      },
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    request.post(deets, (error, response, body) => {
      if (error) return cb(error);
      cb();
    });
  }

}
