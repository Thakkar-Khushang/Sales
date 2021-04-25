require('dotenv').config()
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

function verifyToken(req, res, next) {

  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.provider==="true"){
        req.user = decoded
        next();
    }
    else res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  });

}

module.exports = verifyToken;