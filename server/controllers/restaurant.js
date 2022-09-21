const { application } = require('express');
var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var Item = require('../models/item');
var User = require('../models/user');



//Create a new restaurant
router.post('/api/restaurant',  (req, res,next )=> {
    var restaurant = new Restaurant({
        name:req.body.name,
        address: req.body.address,
        mobile: req.body.mobile,
        'items':req.body.items
    });
    restaurant.save(function(err, restaurant) {
        if (err) { return next(err); }
       res.json(restaurant);
})
})




// delete a restaurant
router.delete('/api/restaurants/:id', function (req, res, next) {
    Restaurant.findByIdAndRemove(req.params.id, req.body, function (err, restaurant) {
        if (err) { return next(err); }
        if (!restaurant) {
            return res.status(404).json({'message': 'Restaurant not found!'});
        }
            res.json({'message': 'Restaurant deleted'});
      });

});

//get all restaurants
router.get('/api/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurant) {
      if (err) { return next(err); }
      res.json({'restaurant': restaurant });
  });
});



//get a restaurant 
router.get('/api/resraurant/:id', function(req, res, next) {
    
      Restaurant.findById(req.params.id).exec()
    .then(restaurant => {
        if (!restaurant) {
            return res.status(404).json({
              message: "Restaurant not found"
            });
          }
          res.status(200).json(restaurant)
    }).catch(err => {
        res.status(500).json({ error: err});
      })
})




router.post('/api/restaurants/:id/items', function(req, res, next) {
  const item = new Item({
      name:req.body.name,
      price: req.body.name,
      category:req.body.name
  });
  item.save(function(err, item) {
      if (err) { return next(err); }
     res.json(item);
  })
  // Restaurant
  //   .findByIdAndUpdate(req.params.id, {
  //     $push: {
  //       items: {
  //         item: item_id
  //         }},
  //     })
  //   .exec()
  //   .then(restaurant => res.json(restaurant))
  //   .catch(e => next(e))



// Restaurant.findByIdAndUpdate(
//   req.params.id,
//   {$push: {"items":{_id: item._id}}},
//   {safe: true, upsert: true, new : true},
//   function(err, resraurant ) {
//       console.log(err);
//   });
});


// ??
router.get('/api/restaurant/:id/items', function (req, res, next) {

   Restaurant.find({ 'item': req.params.id }, function (err, item) {
      if (!item) {

          return res.status(404).json({
              message: "There are no items"
          });
      }
      res.status(200).json({ 'item': item });
  }).populate([{
      path: 'item._id',
      model: 'Item'
  },]).catch(err => {
      res.status(500).json({ error: err });
  });
})
