import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let feedSchema = new Schema({
  name: String,
  description: String,
  url: String,
  lastFetched: Date,
  tracks: [Object]
});

let providerSchema = new Schema({
  name: String,
  description: String,
  feeds: [feedSchema]
});

module.exports = mongoose.model('FeedProvider', providerSchema);
