"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    saveTweet: function(newTweet, callback) {
      db.collection("tweets")
        .insertOne(newTweet)
        .then(callback(null, true))
        .catch(err => callback(err, null));
      // callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if(err) { callback(err, null); }

        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
    });
    }
  };
}


