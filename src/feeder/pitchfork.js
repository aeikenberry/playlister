import feed from 'feed-read';
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

      let titles = [];

      articles.forEach(article => {
        titles.push(article.title);
      });

      let parsedTitles = titles.map((title) => {
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
    return {};
  }

  addTracks(tracks, done) {
    console.log('updaging feeds');

    let feed = {
      name: this.name,
      description: this.description,
      url: this.url,
      albumFeed: this.albumFeed
    };

    Feed.findOne(feed, (err, found) => {

      if (found) {
        console.log(this.name, !!found);
        Feed.findOneAndUpdate(feed, {$pushAll: {tracks: tracks}}, {}, (err, feed) => {
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
    this.albumFeed = true;
  }

  getSpotifyLookupString(title) {
    return `album:"${title.album}"`;
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
  }

  getSearchOptions() {
    return {limit: 1};
  }

  getSpotifyLookupString(title) {
    return `track:"${title.track}"`;
  }

  _parseParts(parts) {
    return {
      artist: parts[0],
      track: parts[1].replace(/"/g, "")
    };
  }
}
