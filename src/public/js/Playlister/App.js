import Marty from 'marty';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ActionCreators from './ActionCreators';
import AppAPI from './AppAPI';
import SpotifyAPI from './SpotifyAPI';
import UserInfo from './components/UserInfo';
import ComponentContainer from './components/ComponentContainer';
import FeedList from './components/FeedList';
import SubscriptionList from './components/SubscriptionList';
import Queries from './Queries';
import Store from './Store';

export default class Playlister extends Marty.Application {
  constructor(options) {
    Marty.HttpStateSource.removeHook('parseJSON');
    super(options);

    injectTapEventPlugin();

    this.options = options;

    this.register('ActionCreators', ActionCreators);
    this.register('AppAPI', AppAPI);
    this.register('SpotifyAPI', SpotifyAPI);
    this.register('Queries', Queries);
    this.register('Store', Store);
    this.register('ComponentContainer', ComponentContainer);
    this.register('UserInfo', UserInfo);
    this.register('FeedList', FeedList);
    this.register('SubscriptionList', SubscriptionList);
  }

  start() {
    React.render(
      <Marty.ApplicationContainer app={this}>
        <ComponentContainer />
      </Marty.ApplicationContainer>,
      this.options.el
    );
  }
}
