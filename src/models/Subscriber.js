import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default mongoose.model('Subscriber', new Schema({
  name: String,
  refreshToken: String,
  subscriptions: [{
      feedId: String,
      playlistId: String
  }]
}));
