const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Необходимо ввести валидную ссылку'],
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'user',
  },
  likes:
  [{
    type: mongoose.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

exports.Card = mongoose.model('card', cardSchema);
