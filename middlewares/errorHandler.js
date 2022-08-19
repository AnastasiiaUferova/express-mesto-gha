module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and set a message depending on it
      message: statusCode === 500
        ? 'Server error'
        : message,
    });
  next(err);
};
