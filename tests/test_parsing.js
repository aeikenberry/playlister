var should = require('should');
var feeds = require('../dist/feeder/pitchfork');

var BestNewAlbums = feeds.BestNewAlbums;
var BestNewTracks = feeds.BestNewTracks;

describe('Pitchfork Feed', function() {

  it('Best New Tracks should get data.', function(done) {
    var bestNewTracks = new BestNewTracks();
    bestNewTracks.getFeed(function(data) {
      data.should.be.an.Array();
      data.should.not.be.empty();
      done();
    });
  });

  it('Best New Albums should get data.', function(done) {
    var bestNewAlbums = new BestNewAlbums();
    bestNewAlbums.getFeed(function(data) {
      data.should.be.an.Array();
      data.should.not.be.empty();
      done();
    });
  });
});
