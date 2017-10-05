import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import resturant from '../controller/restaurant';

let router = express();

//: Connect to db
initializeDb(db => {

  //: Internal middleware
  router.use(middleware({config, db}));

  //: API routes v1
  router.use('/resturant', resturant({config, db}));
});

export default router;
