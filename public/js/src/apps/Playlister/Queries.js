import Marty from 'marty';
import Constants from './Constants';
// import PhotoUtils from '../utils/PhotoUtils';

export default class Queries extends Marty.Queries {
  constructor(options) {
    super(options)

    // this.getPhotos = this.getPhotos.bind(this);
  }

  // getPhotos() {
  //   return this.app.PhotoAPI.getPhotos().then(res => {
  //     let photos = res.map(photo => { return PhotoUtils.createPhoto(photo) });
  //     this.dispatch(PhotoConstants.RECEIVE_PHOTOS, photos);
  //   });
  // }
}
