import Marty from 'marty';
import React from 'react';

class FeedList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (this.props.feeds) {

      let feeds = this.props.feeds.map((feed) => {
        return (
          <li className="playist" key={feed.name}>{feed.name}</li>
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
