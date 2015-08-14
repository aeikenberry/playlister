import dotenv from 'dotenv';
import request from 'request-promise';

dotenv.read();


export default class Spotify {

  constructor() {
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
      cb(body.access_token);
    });
  }

}
