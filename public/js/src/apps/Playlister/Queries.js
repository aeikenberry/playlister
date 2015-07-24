import Marty from 'marty';
import Constants from './Constants';

export default class Queries extends Marty.Queries {
  constructor(options) {
    super(options)

    this.getMe = this.getMe.bind(this);
  }

  getMe() {
    return this.app.SpotifyAPI.getMe(this.app.options.token).then(res => {
      this.dispatch(Constants.RECEIVE_MY_PROFILE, res);
    });
  }
}
