const jwt = require("jsonwebtoken");

//generate the new token from the email and return back the token, expires in 1 hour
const verifyToken = function(data) {
    return token = jwt.sign({
        data: data
    }, 'secretkey', { expiresIn: '1h' });
}

//validate the token based on the set in the authorization from the headers
const validateToken = function(req,res,next) {
    token = req.headers['authorization'];
    if(token===undefined) {
        res.send("Invalid Token");
        return;
    }
    token = token.split(" ");
    jwt.verify(token[1], 'secretkey', function(err,result) {
        if (err) {
            res.send("Invalid Token");return;
        } else {
            req.data = result; //pass the data so directly get login details from it
            req.token = token[1];
            next();
        }
    });
}
module.exports = {verifyToken, validateToken};