import Marty from 'marty';
import React from 'react';

class FeedList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  feedTracks(tracks) {
    console.log('inside feedtracks');
    let _tracks = tracks.map((track) => {
      return (
        <li className="track" key={track.id}>
          <a href={track.preview_url} _target="blank">{track.name}</a>
        </li>
      );
    });

    return (
      <ul className="list-unstyled">
        {_tracks}
      </ul>
    );
  }

  render() {
    if (this.props.feeds) {

      let feeds = this.props.feeds.map((feed) => {
        return (
          <li className="playist" key={feed._id}>
            <h5>{feed.name} <small>{feed.description}</small></h5>
            {this.feedTracks(feed.tracks)}
          </li>
        );
      });

      return (
        <div className="row">
          <div className="col-xs-12">
            <h4>Feeds</h4>
            <ul className="list-unstyled">
              {feeds}
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div>Whaah Happah</div>
      );
    }
  }
}

export default Marty.createContainer(FeedList, {
  listenTo: 'Store',

  fetch: {
    feeds() {
      return this.app.Store.getFeeds();
    }
  },

  pending() {
    return <div>Loading Your Playlists...</div>;
  }
});
