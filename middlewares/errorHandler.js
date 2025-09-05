module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const responseMessage =
    statusCode === 500 ? "Ocurrió un error interno en el servidor" : message;
  res.status(statusCode).json({ message: responseMessage });
};
