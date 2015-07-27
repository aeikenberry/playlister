import Marty from 'marty';
import React from 'react';
import FeedList from './FeedList';
import UserInfo from './UserInfo';
import UserPlaylists from './UserPlaylists';

export default class ComponentContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-3">
          <UserInfo  />
        </div>
        <div className="col-xs-12 col-sm-4">
          <UserPlaylists />
        </div>
        <div className="col-xs-12 col-sm-5">
          <FeedList />
        </div>
      </div>
    );
  }
}
