var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var Order = require('../models/order');


router.post('/api/users/', function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err,user) {
        if (user) {
            var err = new Error('Email already exists');
            err.status = 409;    
            return next(err);
        } else {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {           
                    var err = new Error("password cannot be set");
                    err.status = 500;
                    return next(err);
                } else { 
                    var user1 = new User(
                        {
                            'email': req.body.email,
                            'password': hash
                        });
                        console.log(user1)
                    user1.save(function (err,user ) {
                        if (err) {
                            err.status = 500;
                            return next(err);
                        } else {           
                            res.status(201).json(user);
                        }
                    });
                }
            });
        }
    });
});

router.post('/api/users/login', function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err,user ) {
        if (!user) {    
            var err = new Error('Authentication failed');
            err.status = 401;
            return next(err);
        }
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (err) {
                var err = new Error('Authentication failed');
                err.status = 401;
                return next(err);
            }
            if (result) {
                var token = jwt.sign(
                    {
                    'email': user.email,
                    '_id': user._id
                }, 
                process.env.JWT_KEY || "secret",//private key
                    { 
                        expiresIn: "1h" 
                    });
                return res.status(200).json({
                    message: 'Authentication successful',
                    token: token
                });
            }
            else {
                var err = new Error('Authentication failed');
                err.status = 401;
                return next(err);
            }
        });
    });
});

router.get('/api/users/:id', function(req, res, next) {
    User.findById(req.params.id).select('_id email password').exec()
    .then(user => {
        if (!user) {
            return res.status(404).json({
              message: "User not found"
            });
          }
          res.status(200).json(user)
    }).catch(err => {
        res.status(500).json({ error: err});
      });
});


// Do we need this?
router.get('/api/users', function(req, res, next) {
    User.find().select('_id email').exec()
    .then(users => {
          res.status(200).json(users)
    }).catch(err => {
        res.status(500).json({error: err});
      });
});

router.delete('/api/users/:id', function (req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
        if (err) { return next(err); }
        if (!user) {
            return res.status(404).json({'message': 'User not found!'});
        }
            res.json({'message': 'User deleted'});
      });

});

//DANGER
router.delete('/api/users', function (req, res, next) {
    User.deleteMany(function(err, users) {
        if (err) { return next(err); }
        res.json({'message':'All users deleted.'});
    })

});

router.post('/api/users/:id/orders', function(req, res, next) {
    var order = new Order({
        'items':req.body.items,
        'user':req.params.id,
        createdAt: req.body.createdAt,
        pickUpTime: req.body.pickUpTime
    });
    order.save(function(err, order) {
        if (err) { return next(err); }
       res.json(order);
    });

  User.findByIdAndUpdate(
    req.params.id,
    {$push: {"orders":{_id: order._id}}},
    {safe: true, upsert: true, new : true},
    function(err, user ) {
        console.log(err);
    });
 });

router.get('/api/users/:id/orders', function (req, res, next) {


    Order.find({ 'user': req.params.id }, function (err, order) {
        if (!order) {

            return res.status(404).json({
                message: "There are no orders"
            });
        }
        res.status(200).json({ 'order': order });
    }).populate([{
        path: 'items._id',
        model: 'Item'
    },]).catch(err => {

        res.status(500).json({ error: err });
    });
});

router.get('/api/users/:userId/orders/:orderId', function(req, res, next) {
    Order.findById(req.params.orderId).exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
              message: "Order not found"
            });
          }
          res.status(200).json(order)
    }).catch(err => {
        res.status(500).json({ error: err});
      });
});

router.delete('/api/users/:userId/orders/:orderId', function(req, res, next) {
    Order.findByIdAndRemove(req.params.orderId, req.body, function (err, order) {
        if (err) { return next(err); }
        if (!order) {
            return res.status(404).json({'message': 'Order not found!'});
        }
            res.json({'message': 'order deleted'});
      });
});


router.put("/api/users/:id", (req, res, next) => {
     var id = req.params.id;
     User.findById(id, function(err, user) {
        if (err) { return next(err); }
        if (user == null) {
            return res.status(404).json({ "message": "User not found" });
        }
        user.email = req.body.email 
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {           
                var err = new Error("password cannot be reset");
                err.status = 500;
                return next(err);
            } else {
            user.password = hash
            }
            user.save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(400).send('Something went wrong');
                }else{
                    res.json(user);
                }
            });
        })       
  });
});


 //
 // to be added get an order, get all orders, put an order, delete an order, delete all orders

module.exports = router;
