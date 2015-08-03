import Marty from 'marty';
import React from 'react';
import mui from 'material-ui';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

let Avatar = mui.Avatar;
let FontIcon = mui.FontIcon;
let IconButton = mui.IconButton;
let List = mui.List;
let ListItem = mui.ListItem;
let themeManager = ThemeManager();

class SubscriptionList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  }

  getSubscriptionDetails(subscription) {
    let feedsById = {};
    let playlistsById = {}

    this.props.feeds.forEach(feed => {
      feedsById[feed._id] = feed;
    });

    this.props.playlists.forEach(playlist => {
      playlistsById[playlist.id] = playlist;
    });

    if (subscription.feedId in feedsById && subscription.playlistId in playlistsById) {
      return {
        feedName: feedsById[subscription.feedId].name,
        playlistName: playlistsById[subscription.playlistId].name,
        subscription: subscription
      };
    } else {
      return null;
    }
  }

  handleDelete(subscription) {
    this.app.ActionCreators.unsubscribe(subscription);
  }

  render() {
    let subscriptions = this.props.subscriptions.map(subscription => {
      return this.getSubscriptionDetails(subscription);
    }).filter(subscription => {
      return !!subscription;
    }).map(subscription => {
      console.log(subscription);
      return <ListItem primaryText={subscription.feedName}
                       secondaryText={subscription.playlistName}
                       rightIconButton={<IconButton
                                          iconClassName="material-icons"
                                          tooltipPosition="bottom-center"
                                          onTouchTap={this.handleDelete.bind(this, subscription)}
                                          tooltip="Unsubscribe">clear</IconButton>} />;
    });

    return (
      <div className="row" style={{marginTop: '20px'}} >
        <div className="col-xs-12">
          <h4>Subscriptions</h4>
          <List>{subscriptions}</List>
        </div>
      </div>
    );

  }
}

SubscriptionList.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Marty.createContainer(SubscriptionList, {
  listenTo: 'Store',

  fetch: {
    subscriptions() {
      return this.app.Store.getSubscriptions();
    },

    feeds() {
      return this.app.Store.getFeeds();
    },

    playlists() {
      return this.app.Store.getMyPlaylists();
    }
  },

  pending() {
    return <div>Loading Your Subscriptions...</div>;
  }
});
