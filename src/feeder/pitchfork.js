import feed from 'feed-read';

export default class PitchforkFeed {

    bestNewAlbums(cb) {
        let bestNewAlbumsUrl = 'http://pitchfork.com/rss/reviews/best/albums/';

        this._getFeed(bestNewAlbumsUrl, (titles) => {
            let parsedTitles = titles.map((title) => {
                let parts = title.split(': ');

                if (parts.length === 2) {
                    return {
                        artist: parts[0],
                        album: parts[1]
                    }
                }
            });

            cb(parsedTitles);
        });
    }

    bestNewTracks(cb) {
        let bestNewTracksUrl = 'http://pitchfork.com/rss/reviews/best/tracks/';

        this._getFeed(bestNewTracksUrl, (titles) => {
            let parsedTracks = titles.map((title) => {
                let parts = title.split(': ');

                if (parts.length === 2) {
                    return {
                        artist: parts[0],
                        track: parts[1].replace(/"/g, "")
                    }
                }
            });

            cb(parsedTracks);
        });
    }

    _getFeed(url, cb) {
        feed(url, (err, articles) => {
            let titles = [];

            articles.forEach(article => {
                titles.push(article.title);
            });

            cb(titles);
        });
    }
}
