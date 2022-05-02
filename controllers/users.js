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

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя.'));
      } else {
        next(err);
      }
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Не передан email или пароль'));
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.changeUserInfo = (req, res, next) => {
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
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports.changeUserAvatar = (req, res, next) => {
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
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        next(new UnauthorizedError('Ошибка авторизации'));
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
