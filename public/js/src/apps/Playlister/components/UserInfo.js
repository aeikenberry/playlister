import Marty from 'marty';
import React from 'react';
// import PhotoThumbnail from './PhotoThumbnail';

class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.app.SpotifyAPI.getMe(this.app.options.token)

  }

  render() {
    if (this.props.me) {
      return (
        <div className="row">
          <div className="col-xs-6">
            <img src={this.props.me.images[0].url} />
            <p>{this.props.me.display_name}</p>
            <p>Id: {this.props.me.id}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-thumbnail-panel">Whaah Happah</div>
      );
    }
  }
}

export default Marty.createContainer(UserInfo, {
  listenTo: 'Store',

  fetch: {
    me() {
      return this.app.Store.getMe()
    }
  },

  pending() {
    return <div>Loading Your Profile...</div>;
  }

  // componentWillMount() {
  //   this.app.subscriber.subscribe();
  // },

  // componentWillUnmount() {
  //   this.app.subscriber.unsubscribe();
  // }
});
