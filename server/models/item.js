var mongoose = require('mongoose');
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




module.exports = mongoose.model('Item', itemSchema);