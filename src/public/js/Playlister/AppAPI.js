import Marty from 'marty';

export default class API extends Marty.HttpStateSource {
  getFeeds() {
    return this.get({
      url: this.app.options.urls.feedList
    })
    .then(res => {
       if (res.ok) {
         return res.json();
       }

       throw new Error('Failed to get feeds.');
     });
  }

  createSubscription(userName, refreshToken, feedId, playlistId) {
    return this.post({
      url: this.app.options.urls.subscriptions,
      body: {
        userName: userName,
        refreshToken: refreshToken,
        feedId: feedId,
        playlistId: playlistId
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to create subscription.');
    });
  }

  deleteSubscription(refreshToken, feedId, playlistId) {
    let subscriptions = this.app.Store.getSubscriptions().filter(subscription => {
      return subscription.feedId != feedId && subscription.playlistId != playlistId;
    });

    return this.patch({
      url: this.app.options.urls.subscriptions,
      body: {
        refreshToken: refreshToken,
        subscriptions: subscriptions
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();

        throw new Error('Failed to delete subscription');
      }
    });
  }

  getSubscriptions(token) {
    return this.get({
      url: `${this.app.options.urls.subscriptions}?refreshToken=${this.app.options.refreshToken}`
    })
    .then(res => {
      if (res.ok) {
        console.log('returning subscription json');
        return res.json();
      }

      throw new Error('Failed to fetch subscriptions.');
    });
  }

  refreshToken() {
    return this.get({
      url: `${this.app.options.urls.refreshToken}?refreshToken=${this.app.options.refreshToken}`
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    });
  }
}
