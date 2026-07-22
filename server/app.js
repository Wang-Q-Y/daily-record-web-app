var express = require('express')
var mongoose = require('mongoose')
var morgan = require('morgan')
var path = require('path')
var cors = require('cors')
var history = require('connect-history-api-fallback')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

var userRouter = require('./controllers/users')
var itemRouter = require('./controllers/items')

// Variables
var mongoURI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/animalDevelopmentDB'

const port = process.env.PORT || 5000
console.log('Loaded PORT:', process.env.PORT)

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`)
      console.error(err.stack)
      process.exit(1)
    }

    console.log(`Connected to MongoDB with URI: ${mongoURI}`)
  }
)

// Create Express app
var app = express()

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// HTTP request logger
app.use(morgan('dev'))

// Enable cross-origin resource sharing
app.options('*', cors())
app.use(cors())

// Import routes
app.get('/api', function (req, res) {
  res.json({
    message: 'Welcome to your DIT342 backend ExpressJS project!'
  })
})

app.use(userRouter)
app.use(itemRouter)

// Catch all non-error handler for API routes
app.use('/api/*', function (req, res) {
  res.status(404).json({
    message: 'Not Found'
  })
})

// Configuration for serving frontend in production mode
app.use(history())

var root = path.normalize(__dirname + '/..')
var client = path.join(root, 'client', 'dist')

app.use(express.static(client))

// Error handler must be registered last
var env = app.get('env')

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack)

  var errRes = {
    message: err.message,
    error: {}
  }

  if (env === 'development') {
    errRes.error = err.stack
  }

  res.status(err.status || 500)
  res.json(errRes)
})

// Start the server only once
app.listen(port, function (err) {
  if (err) {
    throw err
  }

  console.log(`Express server listening on port ${port}, in ${env} mode`)
  console.log(`Backend: http://localhost:${port}/api/`)
  console.log(`Frontend (production): http://localhost:${port}/`)
})

module.exports = app