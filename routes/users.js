const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUserById, createUser, getAllUsers, changeUserInfo, changeUserAvatar, login, getCurrentUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);

router.get('/users/me', auth, getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.link().required().min(2),
  }),
}), changeUserAvatar);

router.get('/users', auth, getAllUsers);
router.patch('/users/me/avatar', auth, changeUserAvatar);
router.get('/users/:userId', auth, getUserById);

module.exports = router;
