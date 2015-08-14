import feed from 'feed-read';
import _ from 'lodash';

import Feed from '../models/Feed';

class PitchforkFeed {

  constructor(options) {
    this.albumFeed = false;
  }

  _parseDataParts(parts) {
    throw new Error("Must implement _parseDataParts");
  }

  getFeed(cb) {
    feed(this.url, (err, articles) => {

      let parsedTitles;
      let titles = [];

      articles.forEach(article => {
        titles.push(article.title);
      });

      parsedTitles = titles.map((title) => {
        let parts = title.split(': ');

        if (parts.length === 2) {
          return this._parseParts(parts);
        } else {
          console.log('Error parsing title...', title);
        }
      });

      cb(parsedTitles);
    });
  }

  getSearchOptions() {
    return '';
  }

  addTracks(tracks, done) {
    console.log('updating feeds');

    let feed = {
      name: this.name,
      description: this.description,
      url: this.url,
      albumFeed: this.albumFeed,
      spotifyUrl: this.spotifyUrl
    };

    Feed.findOne(feed, (err, found) => {

      if (found) {
        let tracks = _.uniq(found.tracks.concat(tracks), 'id')
                      .filter((track) => {
                        return track != null;
                      });

        Feed.findOneAndUpdate(feed, {tracks: tracks}, {}, (err, feed) => {
          if (err) console.log(err);
          done();
        });
      } else {
        feed.tracks = tracks;
        Feed.create(feed, (err, feed) => {
          if (err) console.log(err);
          done();
        });
      }
    });
  }
}

export class BestNewAlbums extends PitchforkFeed {
  constructor(options) {
    super(options);
    this.url = 'http://pitchfork.com/rss/reviews/best/albums/';
    this.name = 'Pitchfork Best New Albums';
    this.description = 'Pitchfork.com\'s curated Best New Albums';
    this.spotifyUrl = 'https://open.spotify.com/user/1264695185/playlist/1TcvJsuY3hIGySi07WpLyJ';
    this.albumFeed = true;
  }

  getSpotifyLookupString(title) {
    return `artist:"${title.artist}"+album:"${title.album}"`;
  }

  _parseParts(parts) {
    return {
      artist: parts[0],
      album: parts[1]
    };
  }
}

export class BestNewTracks extends PitchforkFeed {
  constructor(options) {
    super(options);
    this.url = 'http://pitchfork.com/rss/reviews/best/tracks/';
    this.name = 'Pitchfork Best New Tracks';
    this.description = 'Pitchfork.com\'s curated Best New Tracks';
    this.spotifyUrl = 'https://open.spotify.com/user/1264695185/playlist/7ns975S9CKr9cQJ4HW4eqT';
  }

  getSearchOptions() {
    return '&limit=1';
  }

  getSpotifyLookupString(title) {
    let track = encodeURIComponent(title.track);
    let artist = encodeURIComponent(title.artist);
    return `artist:"${artist}"+track:"${track}"`;
  }

  _parseParts(parts) {
    return {
      artist: parts[0],
      track: parts[1].replace(/"/g, "")
    };
  }
}
