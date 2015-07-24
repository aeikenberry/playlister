import Marty from 'marty';
import React from 'react';
import ActionCreators from './ActionCreators';
import AppAPI from './AppAPI';
import SpotifyAPI from './SpotifyAPI';
import UserInfo from './components/UserInfo';
import Queries from './Queries';
import Store from './Store';

export default class Playlister extends Marty.Application {
  constructor(options) {
    Marty.HttpStateSource.removeHook('parseJSON');
    super(options);

    this.options = options;

    this.register('ActionCreators', ActionCreators);
    this.register('AppAPI', AppAPI);
    this.register('SpotifyAPI', SpotifyAPI);
    this.register('Queries', Queries);
    this.register('Store', Store);
    this.register('UserInfo', UserInfo);
  }

  start() {
    React.render(
      <Marty.ApplicationContainer app={this}>
        <UserInfo />
      </Marty.ApplicationContainer>,
      this.options.el
    );
  }
}
