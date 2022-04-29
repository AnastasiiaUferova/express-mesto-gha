const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const NotFoundError = require('./errors/not-found-404');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(userRoutes);
app.use(cardRoutes);

app.use('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next(err);
});

app.listen(PORT);
