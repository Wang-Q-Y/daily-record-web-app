const express = require('express')
const router = express.Router()
const Item = require('../models/item')
const verifyToken = require('../middleware/auth')

// Get all items belonging to the currently logged-in user
router.get('/api/items', verifyToken, async function (req, res, next) {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ date: -1 })
    res.json({ item: items })
  } catch (error) {
    next(error)
  }
})

// Get one item, but only if it belongs to the logged-in user
router.get('/api/items/:id', verifyToken, async function (req, res, next) {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found!' })
    }

    res.json(item)
  } catch (error) {
    next(error)
  }
})

// Create an item for the currently logged-in user
router.post('/api/items', verifyToken, async function (req, res, next) {
  try {
    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      date: req.body.date || Date.now(),
      user: req.user._id
    })

    const savedItem = await item.save()
    res.status(201).json(savedItem)
  } catch (error) {
    next(error)
  }
})

// Update one item, but only if it belongs to the logged-in user
router.put('/api/items/:id', verifyToken, async function (req, res, next) {
  try {
    const updateData = {}

    if (req.body.name !== undefined) updateData.name = req.body.name
    if (req.body.price !== undefined) updateData.price = req.body.price
    if (req.body.category !== undefined) updateData.category = req.body.category
    if (req.body.date !== undefined) updateData.date = req.body.date

    const item = await Item.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    )

    if (!item) {
      return res.status(404).json({ message: 'Item not found!' })
    }

    res.json({
      message: 'Item updated successfully',
      item: item
    })
  } catch (error) {
    next(error)
  }
})

// Delete one item, but only if it belongs to the logged-in user
router.delete('/api/items/:id', verifyToken, async function (req, res, next) {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found!' })
    }

    res.json({ message: 'Item deleted' })
  } catch (error) {
    next(error)
  }
})

// Delete all items belonging to the currently logged-in user
router.delete('/api/items', verifyToken, async function (req, res, next) {
  try {
    await Item.deleteMany({ user: req.user._id })
    res.json({ message: 'Items are now deleted.' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
