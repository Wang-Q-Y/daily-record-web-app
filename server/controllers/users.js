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






//Register  User
// router.post('/api/register', async(req, res)=>{
//     const user =await User.create({
//       name:req.body.name,
//       password:req.body.password,
//       email:req.body.email,
//      
//     })
//       res.send(user)

// })

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


//Login a User
router.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        name: req.body.name
    })
    if (!user) {
        return res.status(402).send({
            message: 'User does not exist'
        })
    }
    const isPasswordVaild = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordVaild) {
        return res.status(402).send({
            message: 'Invalid password'
        })
    }

    //token
    const token = jwt.sign({
        '_id': user._id,
    },
        process.env.JWT_KEY,//private key
        {
            expiresIn: "1h"
        });
    res.send({
        user,
        token
    })
})
//verify user id
router.get('/api/users/verify', async (req, res) => {

    try {
        const token = String(req.headers.authorization.split(' ').pop())

        const { id } = jwt.verify(token, process.env.JWT_KEY)
        req.user = await User.findById(id)

        if ({ id }) {
            res.json(true);
        } else {
            res.json("invaild token");
        }
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
    // res.send(req.user) 
})
//res.send(user)

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
router.put("/api/users/:id", (req, res, next) => {
    var id = req.params.id;
    User.findById(id, function (err, user) {
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
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(400).send('Something went wrong');
                } else {
                    res.json(user);
                }
            });
        })

    });
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
