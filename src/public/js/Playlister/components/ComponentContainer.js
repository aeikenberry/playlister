import Marty from 'marty';
import React from 'react';
import FeedList from './FeedList';
import SubscriptionList from './SubscriptionList';
import UserInfo from './UserInfo';

export default class ComponentContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-3">
          <UserInfo  />
          <SubscriptionList />
        </div>
        <div className="col-xs-12 col-sm-9">
          <FeedList />
        </div>
      </div>
    );
  }
}
