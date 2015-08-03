import Marty from 'marty';
import Constants from './Constants';

export default class ActionCreators extends Marty.ActionCreators {
  subscribe(feedId, playlistId) {
    this.app.AppAPI.createSubscription(
      this.app.Store.state.get('me').display_name,
      this.app.options.refreshToken,
      feedId,
      playlistId)
      .then((subscriber) => {
        this.dispatch(Constants.RECEIVE_SUBSCRIPTIONS, subscriber);
      });
  }

  unsubscribe(subscription)  {
    this.app.AppAPI.deleteSubscription(
      this.app.options.refreshToken,
      subscription.feedId,
      subscription.playlistId
    )
    .then(subscriber => {
      this.dispatch(Constants.RECEIVE_SUBSCRIPTIONS, subscriber);
    });
  }
}
