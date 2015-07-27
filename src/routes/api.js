import express from 'express';
import Feed from '../models/Feed';

let router = express.Router();

/* GET home page. */
router.get('/feeds', (req, res, next) => {
  
  Feed.find((err, feeds) => {
    if (err) {
      res.send(err);
      return;
    }

    res.send({'feeds': feeds});
  });
});

export default router;
