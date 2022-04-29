const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const BadRequestError = require('../errors/bad-request-400');
const NotFoundError = require('../errors/not-found-404');
const UnauthorizedError = require('../errors/unauthorized-401');
const ConflictError = require('../errors/conflict-409');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, err, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный id пользователя.');
      }
      res.send({ data });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, err, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный id пользователя.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, err, next) => {
  const {
    name, about, avatar, email, _id,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
      _id,
    }))
    .then((user) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.changeUserInfo = (req, res, err, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};

module.exports.changeUserAvatar = (req, res, err, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        throw new UnauthorizedError('Ошибка авторизации');
      }
      const token = jwt.sign({ _id: user._id }, 'super-secret-strong-web-code', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'Пользователь успешно залогирован' });
    })
    .catch(next);
};
