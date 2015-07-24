import Immutable from 'immutable';
import Marty from 'marty';
import Constants from './Constants';

export default class Store extends Marty.Store {
  constructor(options) {
    super(options)

    this.state = Immutable.Map({
      me: undefined
    });

    this.handlers = {
      receiveMyProfile: Constants.RECEIVE_MY_PROFILE
    };
  }

  getMe() {
    return this.fetch({
      id: 'me',

      locally() {
        return this.state.get('me');
      },

      remotely() {
        return this.app.Queries.getMe();
      }
    });
  }

  receiveMyProfile(userData) {
    this.state = this.state.set('me', userData);
  }

}
