import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let feedSchema = new Schema({
  name: String,
  description: String,
  url: String,
  lastFetched: Date,
  tracks: []
});

export default mongoose.model('Feed', feedSchema);
