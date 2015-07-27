import async from 'async';
import mongoose from 'mongoose';

import database from '../config/database';
import Feed from '../models/Feed';
import {BestNewAlbums, BestNewTracks} from './pitchfork';
import Spotify from './spotify';

let feeds = [new BestNewAlbums(), new BestNewTracks()];

let spotify = new Spotify();

async.waterfall([

  // Connect to the database
  (callback) => {
    mongoose.connect(database.url, callback);
  },

  // Set our Spotify Auth
  (callback) => {
    spotify.setAuth((api) => {
      callback(null, api);
    });
  },

  // Populate the feeds
  (api, callback) => {

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

          // Lookup Spotify tracks
          async.eachSeries(titles, (title, cb) => {
            api.searchTracks(feed.getSpotifyLookupString(title), feed.getSearchOptions())
              .then((data) => {
                return feed.addTracks(data.body.tracks.items, cb);
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
        }
      ], (err) => {
        if (err) {
          console.log('Error feeding Feed: ' + feed.name, err);
          eachDone(err);
        }
        console.log('Finshed with Feed: ' + feed.name);
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
