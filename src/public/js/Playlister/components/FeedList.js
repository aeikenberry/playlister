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
let FlatButton = mui.FlatButton;
let FontIcon = mui.FontIcon;
let List = mui.List;
let ListItem = mui.ListItem;
let RaisedButton = mui.RaisedButton;
let themeManager = ThemeManager();

class FeedList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.playing = null;
  }

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  }

  handleSubscribeClick(feed) {
    // show the playlist picker
  }

  handlePlaylistClick(playlist, feed) {
    // somthing
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
            leftAvatar={<Avatar src={track.album.images[1].url} />}
            primaryText={track.artists[0].name + ' - ' + track.name}
            rightIcon={<FontIcon className="material-icons" style={playButtonStyle}>play_circle_outline</FontIcon>} />
        );
      });
    } else {
      let albums = _.uniq(feed.tracks.map((track) => {
        return {name: track.album.name, artist: track.artists[0].name, image: track.album.images[1].url};
      }), 'name');
      _tracks = albums.map((album) => {
        return (
          <ListItem
            leftAvatar={<Avatar src={album.image} />}
            primaryText={album.artist + ' - ' + album.name} />
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
    if (this.props.feeds) {

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
              <RaisedButton label="Subscribe" primary={true} style={subscribeButton} />
            </CardHeader>
            {this.feedTracks(feed)}
          </Card>
        );
      });

      let standardActions = [
        { text: 'Cancel' },
        { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
      ];

      return (
        <div className="row feedList">
          <div className="col-xs-12">
            {feeds}
          </div>
          <Dialog
            title="This will be the dialog where you pick which playlist you want."
            actions={standardActions}
            actionFocus="submit"
            modal={true}
            openImmediately={false} >
          </Dialog>
        </div>
      );
    } else {
      return (
        <div>Whaah Happah</div>
      );
    }
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
