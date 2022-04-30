const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  deleteCard, createCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', auth, getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
  }),
}), createCard);

router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
