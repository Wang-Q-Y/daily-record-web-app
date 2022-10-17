var mongoose = require('mongoose');
<<<<<<< HEAD
var schema = mongoose.schema;


var itemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: {type: Number, required: true},
   
});
=======
var Schema = mongoose.Schema;

var itemSchema = new Schema({

  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    types: ['Burger', 'Pasta', 'Drink'],
    required: true
  },
  
  user: { type: mongoose.Schema.Types.ObjectId, required: true }
})


>>>>>>> Qianyuan


module.exports = mongoose.model('Item', itemSchema);