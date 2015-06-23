import Pitchfork from './pitchfork';
import Spotify from './spotify';

let pitchfork = new Pitchfork();
let spotify = new Spotify();

pitchfork.bestNewAlbums((titles) => {
    console.log('BEST NEW ALBUMS');

    titles.forEach(title => {
        console.log(title);
    });
});

pitchfork.bestNewTracks((titles) => {
    console.log('BEST NEW TRACKS!');

    titles.forEach(title => {
        console.log(title);
    });
});

spotify.auth(
    (error, token) => {
        spotify.getMyPlaylists((body) => {
            console.log(body);
        });
    }
);
