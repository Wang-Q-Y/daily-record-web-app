var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    passcode: {type:String, required:true}
});
module.exports = mongoose.model('Employee', employeeSchema);
