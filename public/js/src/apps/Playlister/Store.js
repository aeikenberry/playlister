import Immutable from 'immutable';
import Marty from 'marty';
import Constants from './Constants';

export default class Store extends Marty.Store {
  constructor(options) {
    super(options)

    this.state = Immutable.Map({
      photos: undefined
    });

    // this.handlers = {
    //   receivePhotos: PhotoConstants.RECEIVE_PHOTOS
    // };
  }

  // getPhotos() {
  //   return this.fetch({
  //     id: 'photos',

  //     locally() {
  //       return this.state.get('photos');
  //     },

  //     remotely() {
  //       return this.app.PhotoQueries.getPhotos();
  //     }
  //   });
  // }

  // receivePhotos(photos) {
  //   this.state = this.state.set('photos', photos);
  // }

}
