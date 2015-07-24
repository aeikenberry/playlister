import Marty from 'marty';
import React from 'react';
// import PhotoThumbnail from './PhotoThumbnail';

class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    // if (this.props.photos.length) {
    //   return (
    //     <div className="row">
    //       {this.props.photos.map(photo => {
    //         return <PhotoThumbnail key={photo.get('id')}
    //                                className="col-xs-6 col-md-3"
    //                                app={this.app}
    //                                photo={photo} />
    //       })}
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="empty-thumbnail-panel">No Photos.</div>
    //   );
    // }
    return (
      <div className="row">
        <div className="col-xs-6">Real Content</div>
      </div>
    );
  }
}

export default Marty.createContainer(UserInfo, {
  listenTo: 'Store',

  // fetch: {
  //   photos() {
  //     return this.app.PhotoStore.getPhotos()
  //   }
  // },

  // pending() {
  //   return <div className="empty-thumbnail-panel">Loading...</div>;
  // },

  // componentWillMount() {
  //   this.app.subscriber.subscribe();
  // },

  // componentWillUnmount() {
  //   this.app.subscriber.unsubscribe();
  // }
});
