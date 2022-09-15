var express = require('express');
var router = express.Router();
var User = require('../models/user');

//var Order = require('../models/order');

router.post('/api/users', function(req, res, next){
  try{
      var users = new User(req.body);
  }catch{
      return next(err);
  }
  users.save(function(err, users) {
      if (err) { return next(err); }
      res.status(201).json(users)
  })
});

router.get("/api/users", function (req, res, next) {
  User
    .find()
    .then((response) => {
      res.status(200).json({
        response
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "An error Occured!",
      });
    });
});
module.exports = router;