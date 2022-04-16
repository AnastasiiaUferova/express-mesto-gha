const {Card} = require('../models/card')


module.exports.getAllCards = (req, res) => {
  Card.find({})
        .then(card => res.send({ data: card }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner:req.user._id})
    .then(card => res.send({ data: card }))
    .catch((err)=>{
      if(err.name === 'ValidationError'){
          res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
          return
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере.'});
})};


module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      res.status(200).send({ data: card })})
    .catch((err)=>{
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        console.log(err)
        return
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере.' });

})};


module.exports.likeCard = (req, res) => { Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true })
  .then(card => res.send({ data: card }))
  .catch((err)=>{
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' })
      return
    }
    if(err.name === 'CastError'){
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
      return
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере.'});
})};


module.exports.dislikeCard = (req, res) => { Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
) .then(card => res.send({ data: card }))
.catch((err)=>{
  if(err.name === 'ValidationError'){
    res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' })
    console.log(err)
    return
  }
  if(err.name === 'CastError'){
    res.status(404).send({ message: 'Передан несуществующий _id карточки.' })
    console.log(err)
    return
  }
res.status(500).send({ message: 'Произошла ошибка на сервере.'});
})};