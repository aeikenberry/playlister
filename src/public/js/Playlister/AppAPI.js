import Marty from 'marty';

export default class API extends Marty.HttpStateSource {
  getFeeds() {
    return this.get({
      url: this.app.options.urls.feedList
    })
    .then(res => {
       if (res.ok) {
         return res.json();
       }

       throw new Error('Failed to get feeds.');
     });
  }
}
