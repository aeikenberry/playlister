var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var feedSchema = new Schema({
    name: String,
    url: String,
    description: String
});

module.exports = mongoose.model('Feed', feedSchema);
