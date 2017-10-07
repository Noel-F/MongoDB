import mongoose from 'mongoose';
import {Router} from 'express';
import Restaurant from '../model/restaurant';

export default({config, db}) => {
  let api = Router();

  //: C.R.U.D


  //: /v1/resturant/add - Create
  api.post('/add', (req, res) => {
    let newRest = new Restaurant();
    newRest.name = req.body.name;

    newRest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Restaurant saved successfully!'});
    });
  });

  //: /v1/resturant - Read: Returns all documents.
  api.get('/', (req, res) => {
    Restaurant.find({}, (err,  resturants) => {
      if (err) {
        res.send(err);
      }
      res.json(resturants);
    });
  });

  //: /v1/resturant/:id - Read: returns document based on ID.
  api.get('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, resturant) => {
      if (err) {
        res.send(err)
      }
      res.json(resturant);
    });
  });

  //: /v1/resturant/:id - Update
  api.put('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, resturant) => {
      if (err) {
        res.send(err);
      }
      resturant.name = req.body.name;
      resturant.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Restaurant info updated!"});
      });
    });
  });

  //: /v1/resturant/:id - Delete
  api.delete('/:id', (req, res) => {
    Restaurant.remove({
      _id: req.params.id
    }, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Resturant successfully removed!"});
    });
  });

  return api;
}
