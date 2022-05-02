const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-401');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'super-secret-strong-web-code');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
