import Marty from 'marty';
import React from 'react';
import ActionCreators from './ActionCreators';
import API from './API';
import UserInfo from './components/UserInfo';
import Queries from './Queries';
import Store from './Store';

export default class Playlister extends Marty.Application {
  constructor(options) {
    Marty.HttpStateSource.removeHook('parseJSON');
    super(options);

    this.options = options;

    this.register('ActionCreators', ActionCreators);
    this.register('API', API);
    this.register('UserInfo', UserInfo);
    this.register('Queries', Queries);
    this.register('Store', Store);
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
