var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Order = require('../models/order');
const { patch, request } = require('../app');
var Employee = require('../models/employee');


router.post('/api/employees/login', function (req, res, next) {

    Employee.findOne({}, function (err, employee) {

        if (!employee) {

            var err = new Error('Emp not found');
            err.status = 404;
            return next(err);
        }
        bcrypt.compare(req.body.passcode, employee.passcode, function (err, result) {
            if (err) {
                var err = new Error('Authentication has failed');
                err.status = 401;
                return next(err);
            }

            if (result) {
                var token = jwt.sign(
                    {

                        'passcode': employee.passcode
                    },
                    process.env.JWT_KEY || "secret",//private key
                    {
                        expiresIn: "1h"//should epiresin be commented? because the token seems to work for longer than an hour
                    });



                return res.status(201).json({
                    message: 'Authentication successful',
                    token: token
                });
            }
            else {
                var err = new Error('Authentication has failed');
                err.status = 401;
                return next(err);
            }

        });
    });
});

//changing the password
// the current password is "abc"
router.put('/api/employees/passcode', employeeToken, function (req, res, next) {

    bcrypt.hash(req.body.passcode, 10, function (err, hash) {
        Employee.findOneAndUpdate({}, { $set: { 'passcode': hash } }, function (err, result) {
            if (err) { return next(err); }
            res.json('new passcode set');
        });


    });
});


//initializing a password// basically hardcoding the password
//NOT INCLUDED IN THE FRONTEND
router.post('/api/init-pass', function (req, res, next) {
    bcrypt.hash('onfire', 10, function (err, hash) {

        var employee = new Employee({
            'passcode': hash
        });
        employee.save();
    });
});



function employeeToken(req, res, next) {

    try {

        const token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.decode(token, process.env.JWT_KEY || 'KEY');
        req.userData = decoded;

        if (req.userData.passcode) {
            next();
        }
        else {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });

    }

}

module.exports = router;
