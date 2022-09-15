var jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    try {
        var token = req.headers.authorization.replace('Bearer','');
        console.log(token);
        var decoded = jwt.decode(token, process.env.JWT_KEY||'secret');
        req.userData = decoded;
        next();
    } catch (error) {
         res.status(401).json({message:'Authentication failed'});
    }
    
}