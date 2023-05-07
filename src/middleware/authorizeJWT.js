const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.SERVER_SECRET, function (err, decode) {
      if (err)  {
        req._id = undefined;
        next();
      }
    req._id = global.userDatabase.findIndex( user => user._id ===  decode._id);
    next();
  })}
   else {
    req._id = undefined;
    req.message = "Authorization header not found";
    next();
  }
};
module.exports = verifyToken;