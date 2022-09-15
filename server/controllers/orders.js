var express = require('express');
var router = express.Router();
var Order = require('../models/order');



router.post("/api/order", function (req, res, next) {
    var order = new Order(req.body);
    company.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      console.log("New order ", order.name, "created");
      return res.status(201).json(order);
    });
  });



router.get('/api/orders', function (req, res, next) {

    Order.find(function (err, orders) {
        if (!orders) {

            return res.status(404).json({
                message: "no orders"
            });
        }
        res.status(200).json({ 'orders': orders });
    }).populate([{
        path: 'items._id',
        model: 'Item',
    },
    ]).catch(err => {

        res.status(500).json({ error: err });
    });
});

router.delete('/api/orders',function(req, res, next) {
    Order.deleteMany(function(err, orders) {
        if (err) { return next(err); }
        res.json({'message':'All Orders are now deleted.'});
    })
  });

router.delete('/api/orders/:id' ,function(req, res, next) {
    Order.findByIdAndRemove(req.params.id, req.body, function (err, order) {
      if (err) { return next(err); }
      if (!order) {
          return res.status(404).json({'message': 'Order not found!'});
      }
          res.json({'message': 'order deleted'});
    });
  });

module.exports = router;