const jwt = require("jsonwebtoken");

const verifyToken = function(data) {
    return token = jwt.sign({
        data: data
    }, 'secretkey', { expiresIn: '1h' });
}
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
            req.data = result;
            req.token = token[1];
            next();
        }
    });
}
module.exports = {verifyToken, validateToken};