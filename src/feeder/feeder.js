import async from 'async';
import mongoose from 'mongoose';
import optimist from 'optimist';
import request from 'request-promise';

import database from '../config/database';
import Feed from '../models/Feed';
import {BestNewAlbums, BestNewTracks, AlbumReviews, TrackReviews} from './pitchfork';
import Spotify from './spotify';

let args = optimist.argv._;

let feedHandlers = {
  bna: BestNewAlbums,
  bnt: BestNewTracks,
  ta: TrackReviews,
  aa: AlbumReviews
}

let feeds = args.map(f => {
  return new feedHandlers[f]();
});

let spotify = new Spotify();

async.waterfall([

  // Connect to the database
  (callback) => {
    console.log('connect');
    mongoose.connect(database.url, callback);
  },

  // Populate the feeds
  (callback) => {

    async.each(feeds, (feed, eachDone) => {

      // Each Feed => Feeder
      async.waterfall([

        // Get the feed data
        (done) => {
          feed.getFeed((titles) => {
            done(null, titles);
          });
        },

        (titles, done) => {
          console.log('Looking up Tracks');
          // Lookup Spotify tracks
          async.eachSeries(titles, (title, cb) => {
            request({
              uri: `https://api.spotify.com/v1/search?query=${feed.getSpotifyLookupString(title)}&market=US&type=track${feed.getSearchOptions()}`,
              resolveWithFullResponse: true}).then((data) => {
                let body = JSON.parse(data.body);
                if (body.tracks.items.length) {
                  feed.addTracks(body.tracks.items, cb);
                } else {
                  cb();
                }
              }, (err) => {
                console.log(err);
                err ? cb(err) : cb();
              });
          }, (err) => {
            if (err) {
              done(err);
            } else {
              done();
            }
          });
        },

        // Update the spotify playlists
        (done) => {
          console.log('starting the playlists');
          async.waterfall([
            d => {
              spotify.getToken(t => {
                d(null, t);
              });
            },
            (token, d) => {
              spotify.addTracksToFeed(feed, token, d);
            }
          ], err => {
            if (err) {
              console.log(err);
              return done(err);
            }

            done();
          });
        }
      ], (err) => {
        if (err) {
          console.log('Error feeding Feed: ' + feed.name, err);
          eachDone(err);
        }
        console.log('Finished with Feed: ' + feed.name);
        eachDone();
      });

    }, (err) => {
      if (err) console.log(err);
      callback();
    })
  }

], (err) => {
  if (err) console.log(err);
  mongoose.disconnect();
  console.log('exiting');
});
