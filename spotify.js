import request from 'request';

export default class Spotify {
    constructor() {
        this.apiBase = 'https://api.spotify.com';
        this.userId = '1264695185';
        this.client_id = '8eefcfde253e44b79a9f778daf9513d1';
        this.client_secret = 'e53ffdc883374edda08abf95dd8b8e0b';
        this.redirect_uri = 'http://localhost:8888/callback';
        this.token = null;
    }

    auth(cb) {
        let scopes = [
            'playlist-modify-private',
            'playlist-modify-public',
            'playlist-read-collaborative',
            'playlist-read-private'
        ];
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token' + '&scope=' + 'playlist-modify-private,playlist-modify-public,playlist-read-collaborative,playlist-read-private',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(this.client_id + ':' + this.client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        console.log(authOptions.url);

        request.post(authOptions, (error, response, body) => {
            this.token = body.access_token;
            console.log("auth post", error, body);
            cb(error, this.token);
        });
    }

    getMyPlaylists(cb) {
        var options = {
            url: `${this.apiBase}/v1/users/${this.userId}/playlists`,
            headers: {
                'Authorization': 'Bearer ' + this.token
            },
            json: true
        };

        request.get(options, (error, response, body) => {
            console.log(error, body);
            cb(body);
        });
    }
}
