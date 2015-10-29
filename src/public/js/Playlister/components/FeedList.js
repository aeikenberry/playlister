import Marty from 'marty';
import React from 'react';
import mui from 'material-ui';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import _ from 'lodash';

import SubscriptionDialog from './SubscriptionDialog';

let Avatar = mui.Avatar;
let Card = mui.Card;
let CardActions = mui.CardActions;
let CardHeader = mui.CardHeader;
let CardText = mui.CardText;
let FlatButton = mui.FlatButton;
let FontIcon = mui.FontIcon;
let IconMenu = mui.IconMenu;
let IconButton = mui.IconButton;
let List = mui.List;
let ListItem = mui.ListItem;
let RaisedButton = mui.RaisedButton;
let MenuItem = require('material-ui/lib/menus/menu-item');
let themeManager = ThemeManager();

class FeedList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.playing = null;
    this.seletedFeed = null;
  }

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  }

  handleSubscribeClick(feed) {
    this.setState({ selectedFeed: feed }, () => {
      this.refs.subscriptionDialog.refs.innerComponent.refs.dialog.show()
    });
  }

  handleTrackClick(track) {
    if (this.playing) {
      this.playing.pause();
      this.playing = null;
    }

    this.playing = new Audio(track.preview_url);
    this.playing.play();
  }

  feedTracks(feed) {
    let _tracks = [];
    let playButtonStyle = {
      marginRight: '20px'
    };

    if (!feed.albumFeed) {
      _tracks = feed.tracks.map((track) => {
        return (
          <ListItem
            onTouchTap={this.handleTrackClick.bind(this, track)}
            leftAvatar={<Avatar src={track.album.images[1].url} /> }
            primaryText={track.artists[0].name + ' - ' + track.name}
            rightIcon={
              <FontIcon className="material-icons" style={playButtonStyle}>play_circle_outline</FontIcon>} />
        );
      });
    } else {
      let albumTracks = {};

      let albums = _.uniq(feed.tracks.map((track) => {
        let image;
        if (track.album.images.length) {
          image = track.album.images[1].url;
        } else {
          image = '';
        }

        let artistName;
        if (track.artists.length) {
          artistName = track.artists[0].name;
        } else {
          artistName = '???';
        }

        if (!albumTracks.hasOwnProperty(track.album.name)) {
          albumTracks[track.album.name] = track;
        }

        return { name: track.album.name, artist: artistName, image: image };
      }), 'name');

      _tracks = albums.map((album) => {
        var track = albumTracks[album.name];
        return (
          <ListItem
            onTouchTap={this.handleTrackClick.bind(this, track)}
            leftAvatar={<Avatar src={album.image} />}
            primaryText={album.artist + ' - ' + album.name}
            rightIcon={<FontIcon className="material-icons" style={playButtonStyle}>play_circle_outline</FontIcon>} />
        );
      });
    }

    return (
      <List expandable={true}>
        {_tracks}
      </List>
    );
  }

  render() {
    var subscribeButton = {
      float: 'right',
      marginRight: '50px'
    };

    let feeds = this.props.feeds.map((feed) => {
      return (
        <Card initiallyExpanded={false}>
          <CardHeader
            title={feed.name}
            subtitle={feed.description}
            showExpandableButton={true}
            avatar={<Avatar icon={<FontIcon className="material-icons">queue_music</FontIcon>} />} >
            <RaisedButton label="Subscribe" primary={true} style={subscribeButton} onTouchTap={this.handleSubscribeClick.bind(this, feed)} />
          </CardHeader>
          {this.feedTracks(feed)}
        </Card>
      );
    });

    return (
      <div className="row feedList">
        <div className="col-xs-12">
          {feeds}
          <SubscriptionDialog feed={this.state ? this.state.selectedFeed : null} ref="subscriptionDialog" />
        </div>
      </div>
    );

  }
}

FeedList.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Marty.createContainer(FeedList, {
  listenTo: 'Store',

  fetch: {
    feeds() {
      return this.app.Store.getFeeds();
    }
  },

  pending() {
    return <div>Loading Data Feeds...</div>;
  }
});
