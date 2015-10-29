import Marty from 'marty';
import Constants from './Constants';

export default class API extends Marty.HttpStateSource {
  constructor(options) {
    super(options);

    this.apiURL = 'https://api.spotify.com/v1/';
    this.headers = {
      'Authorization': 'Bearer ' + this.app.options.token
    }
  }

  getMe(token) {
    return this.get({
      url: this.apiURL + 'me',
      headers: this.headers
    })
    .then(res => {
      if (res.ok) {
       return res.json();
      }
     });
  }

  getMyPlaylists(userId) {
    return this.get({
      url: this.apiURL + 'users/' + userId + '/playlists',
      headers: this.headers
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
    })
  }
}
