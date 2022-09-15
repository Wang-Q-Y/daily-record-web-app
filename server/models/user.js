
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
 
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   // orders:[{type:mongoose.Schema.Types.ObjectId, ref:'Order'}]
});

module.exports = mongoose.model('User', userSchema);
