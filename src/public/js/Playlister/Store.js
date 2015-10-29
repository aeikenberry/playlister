import Immutable from 'immutable';
import Marty from 'marty';
import Constants from './Constants';

export default class Store extends Marty.Store {
  constructor(options) {
    super(options)

    this.state = Immutable.Map({
      me: undefined,
      spotifyUserId: undefined,
      playlists: undefined,
      feeds: undefined,
      subscriptions: undefined
    });

    this.handlers = {
      receiveMyProfile: Constants.RECEIVE_MY_PROFILE,
      receivePlaylists: Constants.RECEIVE_PLAYLISTS,
      receiveFeeds: Constants.RECEIVE_FEEDS,
      receiveSubscriptions: Constants.RECEIVE_SUBSCRIPTIONS
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

  getMyPlaylists() {
    return this.fetch({
      id: 'playlists',
      dependsOn: this.getMe(),

      locally() {
        return this.state.get('playlists');
      },

      remotely() {
        return this.app.Queries.getMyPlaylists(this.state.get('spotifyUserId'));
      }
    });
  }

  getFeeds() {
    return this.fetch({
      id: 'feeds',

      locally() {
        return this.state.get('feeds');
      },

      remotely() {
        return this.app.Queries.getFeeds();
      }
    });
  }

  getSubscriptions() {
    return this.fetch({
      id: 'subscriptions',

      locally() {
        return this.state.get('subscriptions');
      },

      remotely() {
        return this.app.Queries.getSubscriptions();
      }
    });
  }

  receiveMyProfile(userData) {
    this.state = this.state.set('me', userData);
    this.state = this.state.set('spotifyUserId', userData.id);
  }

  receivePlaylists(data) {
    this.state = this.state.set('playlists', data.items);
  }

  receiveFeeds(data) {
    this.state = this.state.set('feeds', data.feeds);
  }

  receiveSubscriptions(data) {
    if (!!data.subscriber) {
      this.state = this.state.set('subscriptions', data.subscriber.subscriptions);
    } else {
      this.state = this.state.set('subscriptions', []);
    }
  }

}
