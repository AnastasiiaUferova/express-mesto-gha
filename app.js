const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-404');
const { createUser, login } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Logout' });
});

app.use('*', () => {
  throw new NotFoundError('Source was not found');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
