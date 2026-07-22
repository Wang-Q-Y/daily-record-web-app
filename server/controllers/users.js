const express = require('express')
const Joi = require('joi')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Item = require('../models/item')
const verifyToken = require('../middleware/auth')

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
        .email()
        .required()
})

const loginUser = Joi.object({
    name: Joi.string()
        .alphanum()
        .max(50)
        .required(),
    password: Joi.string()
        .alphanum()
        .max(20)
        .required(),
    email: Joi.string()
        .email()
        .required()
})

const updateUser = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().alphanum().max(20)
}).min(1)

const sanitizeUser = function (user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    }
}

// Register a new user
router.post('/api/register', function (req, res, next) {
    const result = createUser.validate(req.body)

    if (result.error) {
        return res.status(400).json({ message: result.error.details[0].message })
    }

    const user = new User(req.body)

    user.save(function (err, savedUser) {
        if (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: 'This username is already taken' })
            }

            return next(err)
        }

        res.status(201).json(sanitizeUser(savedUser))
    })
})

// Login a user
router.post('/api/login', async function (req, res) {
    try {
        const result = loginUser.validate(req.body)

        if (result.error) {
            return res.status(400).json({
                message: result.error.details[0].message
            })
        }

        const user = await User.findOne({ name: req.body.name })

        if (!user) {
            return res.status(401).json({
                message: 'Username does not exist'
            })
        }

        if (user.email !== req.body.email) {
            return res.status(401).json({
                message: 'Email does not match this username'
            })
        }

        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Incorrect password'
            })
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )

        res.json({
            user: sanitizeUser(user),
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// Verify token
router.get('/api/users/verify', verifyToken, async function (req, res) {
    res.json({
        valid: true,
        user: sanitizeUser(req.user)
    })
})

// Get current logged-in user
router.get('/api/users/me', verifyToken, async function (req, res) {
    res.json(sanitizeUser(req.user))
})

// Update current logged-in user
router.put('/api/users/me', verifyToken, async function (req, res, next) {
    try {
        const result = updateUser.validate(req.body)

        if (result.error) {
            return res.status(400).json({ message: result.error.details[0].message })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.body.email) {
            user.email = req.body.email
        }

        if (req.body.password) {
            user.password = req.body.password
        }

        await user.save()

        res.json({
            message: 'User updated successfully. Please log in again.',
            requireRelogin: true
        })
    } catch (error) {
        next(error)
    }
})

// Block public access to all users
router.get('/api/users', verifyToken, function (req, res) {
    res.status(403).json({
        message: 'Access denied. Users can only access their own profile.'
    })
})

// Block access by user id
router.get('/api/user/:id', verifyToken, function (req, res) {
    res.status(403).json({
        message: 'Access denied. Please use /api/users/me.'
    })
})

// Block update by user id
router.put('/api/users/:id', verifyToken, function (req, res) {
    res.status(403).json({
        message: 'Access denied. Please use /api/users/me.'
    })
})

// Delete current logged-in user
router.delete('/api/users/me', verifyToken, function (req, res, next) {
    User.findOneAndDelete({ _id: req.user._id }, function (err, user) {
        if (err) {
            return next(err)
        }

        if (user === null) {
            return res.status(404).json({ message: 'User not found' })
        }

        Item.deleteMany({ user: req.user._id }).exec()

        res.json({ message: 'User deleted.' })
    })
})

module.exports = router