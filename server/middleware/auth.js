const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verifyToken = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid token provided' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const user = await User.findById(decoded._id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = verifyToken
