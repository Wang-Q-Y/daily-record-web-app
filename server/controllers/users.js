const express = require('express');
const Joi = require('joi')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const {verify} = require("../middleware/verify");
const Item = require('../models/item');

const createUser = Joi.object({
    name: Joi.string()
        .alphanum()
        .max(50)
        .required(),
    password: Joi.string()
        .alphanum()
        .max(20)
        .required(),
    email: Joi.string()

        .required()
});



//Register a new user
router.post('/api/register', function (req, res, next) {
    const { error } = createUser.validate(req.body)
    if (error) {
        return res.status(400).json({ "message": error.details[0].message })
    }
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) { return next(err); }
        res.status(201).json(user);
    })
})


// Login a user
router.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            return res.status(401).json({
                message: 'User does not exist'
            });
        }

        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Verify token
router.get('/api/users/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ').pop();

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid token: user not found'
            });
        }

        res.json({
            valid: true,
            userId: user._id
        });
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
});


//get all users
router.get('/api/users', function (req, res, next) {
    User.find(function (err, user) {
        if (err) { return next(err); }
        res.json({ 'users': user });
    });
});

//get a user
router.get('/api/user/:id', function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) { return next(err); }
        if (user === null) {
            return res.status(404).json({ 'message': 'User not found!' });
        }
        res.json(user);
    });
});

//test
router.put('/api/users/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.password) {
            user.password = req.body.password; 
    
        }

        await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});






//detele a user
router.delete('/api/user/:id', function (req, res, next) {
    var id = req.params.id;
    User.findOneAndDelete({ _id: id }, function (err, user) {
        if (err) { return next(err); }
        Item.deleteMany({ user: req.params.id })
        if (user === null) {
            return res.status(404).json({ 'message': 'User not found' });
        }
        res.json({ 'message': 'user deleted.' });
    });
});



module.exports = router;
