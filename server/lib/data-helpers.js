"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const objId = require("mongodb").ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    saveTweet: function(newTweet, callback) {
      db.collection("tweets")
        .insertOne(newTweet)
        .then(callback(null, true))
        .catch(err => callback(err, null));
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if(err) { callback(err, null); }
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
    });
    },

    updateTweets: function(userId, likes, likeStatus, callback) {
      db.collection("tweets").update({"_id": objId(userId)},
        {$set: { "likes": likes, "likeStatus": likeStatus } }
        ).then(callback(null, true));
    },
    findUser: function(userName, password, callback) {
      db.collection("users")
      .findOne({Username: userName, Password: password})
      .then(result => {
        console.log(result);
        callback(null, result);
      })
    }
  };
}


