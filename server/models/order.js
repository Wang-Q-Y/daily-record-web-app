var mongoose = require('mongoose');
var schema = mongoose.schema;

var orderSchema = new mongoose.Schema(
    {
    items: [
        {
            _id: {type:mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
            quantity: {type: Number}
        }
        ],
    createdAt:{type:String},
    pickUpTime:{type:String },
    user : {type: mongoose.Schema.Types.ObjectId}
});

module.exports = mongoose.model('Order', orderSchema);
