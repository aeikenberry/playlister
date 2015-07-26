import Marty from 'marty';
import React from 'react';

class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (this.props.me) {
      return (
        <div className="row">
          <div className="col-xs-6">
            <img src={this.props.me.images[0].url} />
            <h2>{this.props.me.display_name}</h2>
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
});
