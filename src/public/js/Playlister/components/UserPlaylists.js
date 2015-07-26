import Marty from 'marty';
import React from 'react';

class UserPlaylists extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  handleAddPlaylist(event) {
    event.preventDefault();

    console.log('they want a new playlist');
  }

  render() {
    if (this.props.playlists) {

      let playlists = this.props.playlists.map((playlist) => {
        return (
          <li className="playist" key={playlist.id}>{playlist.name}</li>
        );
      });

      return (
        <div className="row">
          <div className="col-xs-12">
            <h4>Playlists</h4>
            <ul className="list-unstyled">
              {playlists}
            </ul>
            <a href="#" onClick={this.handleAddPlaylist}>+ Add</a>
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

export default Marty.createContainer(UserPlaylists, {
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
