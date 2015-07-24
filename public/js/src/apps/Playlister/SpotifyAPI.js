import Marty from 'marty';
import Constants from './Constants';

export default class API extends Marty.HttpStateSource {
  getMe(token) {
    return this.get({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => {
       if (res.ok) {
         return res.json();
       }
     });
  }
}
