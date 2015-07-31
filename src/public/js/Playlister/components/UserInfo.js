import Marty from 'marty';
import React from 'react';
import mui from 'material-ui';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

let Avatar = mui.Avatar;
let themeManager = ThemeManager();

class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  }

  render() {
    if (this.props.me) {
      return (
        <div className="row userInfo">
          <div className="col-xs-12">
            <Avatar src={this.props.me.images[0].url}>
              <h4 style={{left: '67px', top: '0', position: 'absolute'}}>{this.props.me.display_name}</h4>
            </Avatar>
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

UserInfo.childContextTypes = {
  muiTheme: React.PropTypes.object
};

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
