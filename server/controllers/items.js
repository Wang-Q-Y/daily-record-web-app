const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user')








//get a item
router.get('/api/items/:id', function (req, res, next) {
  Item.findById(req.params.id, function (err, item) {
    if (err) { return next(err); }
    if (!item) {
      return res.status(404).json({ 'message': 'Item not found!' });
    }
    res.json(item);
  });
});


//delete a item
router.delete('/api/items/:id', function (req, res, next) {

  Item.findByIdAndRemove(req.params.id, req.body, function (err, item) {
    if (err) { return next(err); }
    if (!item) {
      return res.status(404).json({ 'message': 'Item not found!' });
    }
    res.json({ 'message': 'item deleted' });
  });


});

//delete all items
router.delete('/api/user/:id/items', function (req, res, next) {
  Item.deleteMany({user:req.params.id},function (err, items) {
    if (err) { return next(err); }
    res.json({ 'message': 'Items are now deleted.' });
  })
});


router.post('/api/user/:id/items', function (req, res, next) {
  user = User.findById(req.params.id);

  var item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,

    user: req.params.id
  });
  item.save(function (err, item) {
    if (err) { return next(err); }
    res.json(item);
  });
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { "items": { _id: item._id } } },
    { safe: true, upsert: true, new: true },
    function (err, user) {
      console.log(err);
    });

});


//get a item
router.get('/api/user/:id/items',async function (req, res, next) {
  const data = await Item.aggregate([
    {
      $match:{
        user:mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $sort:{price:1}
    }
  ])
  res.json({item:data})
  // Item.find({ user: req.params.id }, function (err, item) {
  //   console.log(item,'sss')
  //     if (!item) {

  //         return res.status(404).json({
  //             message: "There are no items"
  //         });
  //     }
  //     res.status(200).json({ 'item': item });
  // }).populate([{
  //     path: 'items._id',
  //     model: 'Item'
  // },]).sort({price:1})

  

  

});


module.exports = router
