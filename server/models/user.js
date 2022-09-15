var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    email: { type: String , unique:true, 
    match: /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/,
    required:true},
    password: { type: String, required:true},
    orders:[{type:mongoose.Schema.Types.ObjectId, ref:'Order'}]
});

module.exports = mongoose.model('User', userSchema);
