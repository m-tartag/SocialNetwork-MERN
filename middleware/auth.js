const jwt = require('jsonwebtoken');
const config = require('config');

// This is a middleware function
// it has access to the (req and res)

// NEXT is a callback that you have to run so that after
// this middleware is complete... then next middleware can start

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if NO token

  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization Denied' });
  }

  // Verify Token (Decode)
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
