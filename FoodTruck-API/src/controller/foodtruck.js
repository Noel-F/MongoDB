import mongoose from 'mongoose';
import {Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

import {authenticate} from '../middleware/authMiddleware';

export default({config, db}) => {
  let api = Router();

  //: C.R.U.D
  //: /v1/foodtruck/add - Create
  api.post('/add', authenticate, (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'FoodTruck saved successfully!'});
    });
  });

  //: /v1/foodtruck - Read: Returns all documents.
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err,  foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  //: /v1/foodtruck/:id - Read: returns document based on ID.
  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err)
      }
      res.json(foodtruck);
    });
  });

  //: /v1/foodtruck/:id - Update
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({message: "FoodTruck info updated!"});
      });
    });
  });

  //: /v1/foodtruck/:id - Delete
  api.delete('/:id', (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      Review.remove({
        foodtruck: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Food Truck and Reviews Successfully Removed!"});
      });
    });
  });

  //: Add review for a specific foodtruck id.
  //: /v1/foodtruck/reviews/add/:id
  api.post('reviews/add/:id', (rew, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
        let newReview = new Review();

        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.foodtruck = foodtruck._id;
        newReview.save((err, review) => {
          if (err) {
            res.send(err);
          }
          foodtruck.reviews.push(newReview);
          foodtruck.save(err => {
            if (err) {
              res.send(err);
            }
            res.json({message: 'Food Truck review saved!'});
          });
        });
    });
  });

  //: Get reviews for specific food truck.
  //: /v1/foodtruck/reviews/:id
  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  //: Get foodtype for specific food truck.
  //: /v1/foodtruck/reviews/:id
  api.get('/foodtype/:foodtype',(req, res) => {
    FoodTruck.find({foodtype: req.params.foodtype}, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  return api;
}
