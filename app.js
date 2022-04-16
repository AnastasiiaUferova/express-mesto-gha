const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const cardRoutes = require('./routes/cards')

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6257f13d5b21e6bec8da822e"
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);


app.listen(PORT, () => {
  console.log('Сервер');
});



