import Marty from 'marty';
import React from 'react';
import mui from 'material-ui';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import _ from 'lodash';

let Avatar = mui.Avatar;
let Card = mui.Card;
let CardActions = mui.CardActions;
let CardHeader = mui.CardHeader;
let CardText = mui.CardText;
let Dialog = mui.Dialog;
let DropDownMenu = mui.DropDownMenu;
let FlatButton = mui.FlatButton;
let FontIcon = mui.FontIcon;
let List = mui.List;
let ListItem = mui.ListItem;
let RaisedButton = mui.RaisedButton;
let themeManager = ThemeManager();

class SubscriptionDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  }

  handleSubmit() {
    let playlistID = this.state.playlist.payload;
    this.app.ActionCreators.subscribe(this.props.feed._id, playlistID);
    this.refs.dialog.dismiss();
  }

  playlistSelected(e, index, menuItem) {
    this.setState({playlist: menuItem});
  }

  handleAddPlaylist(event) {
    event.preventDefault();

    console.log('they want a new playlist');
  }

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: this.handleSubmit.bind(this), ref: 'submit' }
    ];

    let menuItems = this.props.playlists.map((playlist) => {
      return { payload: playlist.id, text: playlist.name };
    });

    console.log('hello hello', this.props);
    return (
      <Dialog
        title={this.props.feed ? "Subscribe to " + this.props.feed.name : ''}
        actions={standardActions}
        actionFocus="submit"
        openImmediately={false}
        contentInnerStyle={{minHeight: '200px'}}
        ref="dialog" >
        <div style={{minHeight: '400px'}}>
          <DropDownMenu menuItems={menuItems} ref="playlistPicker" onChange={this.playlistSelected.bind(this)} />
        </div>
      </Dialog>
    );
  }
}

SubscriptionDialog.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Marty.createContainer(SubscriptionDialog, {
  listenTo: 'Store',

  fetch: {
    playlists() {
      return this.app.Store.getMyPlaylists();
    }
  },

  pending() {
    return <div>Loading Your Playlists...</div>;
  }
});
