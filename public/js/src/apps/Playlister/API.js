import Marty from 'marty';

export default class API extends Marty.HttpStateSource {
  getPhotos() {
    return this.get({
      url: `${this.app.options.urls.photoList}?thumbnail=original_250x0`
    })
    .then(res => {
       if (res.ok) {
         return res.json();
       }

       throw new Error('Failed to get photos.');
     });
  }
}
