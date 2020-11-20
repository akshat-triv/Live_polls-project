const errorHandleDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorHandleDev(err, req, res);
  }
};
