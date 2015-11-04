import express from 'express';
import _ from 'lodash';

import Feed from '../models/Feed';
import Subscriber from '../models/Subscriber';

let router = express.Router();

/* GET home page. */
router.get('/feeds', (req, res, next) => {

  Feed.find((err, feeds) => {
    if (err) {
      res.send(err);
      return;
    }

    res.send({feeds: feeds});
  });
});

router.get('/refresh-token', (req, res, next) => {
  let refreshToken = req.query.refreshToken;
});

router.get('/subscriptions', (req, res, next) => {
  let refreshToken = req.query.refreshToken;

  Subscriber.findOne({ refreshToken: refreshToken }, (err, found) => {
    if (err) {
      res.send(err);
      return;
    }

    res.send({ subscriber: found });
  });
});

router.patch('/subscriptions', (req, res, next) => {
  Subscriber.findOneAndUpdate(
    { refreshToken: req.body.refreshToken },
    { subscriptions: req.body.subscriptions }, (err, found) => {
      if (err) {
        res.send(err);
        return;
      }

      res.send({ subscriber: found });
    }
  );
});

router.post('/subscriptions', (req, res, next) => {
  let refreshToken = req.body.refreshToken;
  let name = req.body.userName;
  let feedId = req.body.feedId;
  let playlistId = req.body.playlistId;

  console.log(req.body);

  let key = { refreshToken: refreshToken, name: name};

  Subscriber.findOne(key, (err, found) => {
    if (found) {
      let subscriptions = _.uniq(found.subscriptions.concat(
        [{feedId: feedId, playlistId: playlistId}]));

      Subscriber.findOneAndUpdate(key, {subscriptions: subscriptions}, (err, sub) => {
        if (err) {
          res.send(err);
          return;
        }

        res.send({subscriber: sub});
      });
    } else {
      Subscriber.create({
        refreshToken: refreshToken,
        name: name,
        subscriptions: [
          {
            feedId: feedId,
            refreshToken: refreshToken,
          },
        ],
      }, (err, sub) => {
        if (err) {
          res.send(err);
          return;
        }

        res.send({subscriber: sub});
      });
    }
  });
});

export default router;
