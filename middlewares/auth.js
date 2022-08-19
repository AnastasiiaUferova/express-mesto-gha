const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-401');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Authorization required');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    // try to verify the token
    payload = jwt.verify(token, 'super-secret-strong-web-code');
  } catch (err) {
    // send an error if it fails
    throw new UnauthorizedError('Authorization required');
  }

  req.user = payload; // adding the payload to the request object

  return next();
};
