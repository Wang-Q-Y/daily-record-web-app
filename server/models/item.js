var mongoose = require('mongoose');
var schema = mongoose.schema;


var itemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: {type: Number, required: true},
   
});


module.exports = mongoose.model('Item', itemSchema);