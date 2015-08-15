import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let feedSchema = new Schema({
  name: String,
  description: String,
  url: String,
  lastFetched: Date,
  tracks: [],
  albumFeed: Boolean,
  spotifyUrl: String,
  playlistId: String
});

export default mongoose.model('Feed', feedSchema);
