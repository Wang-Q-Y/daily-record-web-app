var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String,unique:true},
    
    password:{type:String,required:true,set(val){return require("bcryptjs").hashSync(val,5)}},
 //Inside the Schema, use the set method to encrypt the incoming val by calling bcryptjs' hashSync with encryption level 5
    email:{type:String},
    

});

//var users=mongoose.model('User',users );


module.exports = mongoose.model('User', userSchema);
