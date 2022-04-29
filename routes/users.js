const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUserById, getAllUsers, changeUserInfo, changeUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), auth, getUserById);

router.get('/me', auth, getCurrentUser);

router.get('/', auth, getAllUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2),
  }),
}), auth, changeUserAvatar);

module.exports = router;
// new
