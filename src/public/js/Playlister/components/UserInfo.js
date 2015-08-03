import Marty from 'marty';
import React from 'react';
import mui from 'material-ui';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

let Avatar = mui.Avatar;
let FontIcon = mui.FontIcon;
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
      var avatar;
      var userName = <h4 style={{left: '67px', top: '0', position: 'absolute'}}>{this.props.me.display_name}</h4>;
      if (this.props.me.images.length) {
        avatar = (
          <Avatar src={this.props.me.images[0].url}></Avatar>
        );
      } else {
        let avatarLetter = this.props.me.display_name.charAt(0);
        avatar = (
          <Avatar
            icon={<FontIcon className="material-icons">perm_identity</FontIcon>}>
            {avatarLetter}
          </Avatar>
        );
      }

      return (
        <div className="row userInfo">
          <div className="col-xs-12">
            {userName}
            {avatar}
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
