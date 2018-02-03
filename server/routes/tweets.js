"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();


module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", (req, res) => {
    const userName = req.body.userName;
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser(userName);
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      likes: 0,
      likeStatus: "unlike",
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.post("/login", (req, res) => {
    console.log(req.body);
    DataHelpers.findUser(req.body.userName, req.body.password, (err, userName) => {
      console.log("err", err);
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(userName);
      }
    });
  });

  tweetsRoutes.post("/:id/likes", (req, res) => {
    DataHelpers.updateTweets(req.params.id, req.body.likes, req.body.likeStatus, (err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });
  return tweetsRoutes;
}
