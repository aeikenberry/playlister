import spotifyApi from 'spotify-web-api-node';

export default class Spotify {

  constructor() {
    this.myUserId = '1264695185';
    this.client_id = '8eefcfde253e44b79a9f778daf9513d1';
    this.client_secret = '5130418757914c2e87ba45846d6c7592';
    this.redirect_uri = 'http://localhost:8000/app/';
    this.api = new spotifyApi({
      clientId: this.client_id,
      clientSecret: this.client_secret,
      redirectUri: this.redirect_uri
    });
    this.token = null;
  }

  setAuth(cb) {
    this.api.clientCredentialsGrant()
      .then((data) => {
        this.token = data.body.access_token;
        this.api.setAccessToken(this.token);
        cb(this.api);
      }, (err) => {
        cb(err);
      });
  }
}
