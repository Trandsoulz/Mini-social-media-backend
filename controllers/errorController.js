const AppError = require("../utils/AppError");

const config = process.env;

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stacktrace: err.stack,
  });
};

const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`Err 🤯`, err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// ! Formatted errors

const duplicateFieldError = (err) => {
  console.log(err);
  const message = `Duplicate field: '${
    Object.keys(err.keyValue)[0]
  }'. Use another.`;
  return new AppError(message, 400);
};

// ! Export error Handler

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (config.NODE_ENV === "prod") {
    let error = { ...err };
    console.log(error);
    if (error.code === 11000) error = duplicateFieldError(error);

    prodError(error, res);
  }
  devError(err, res);
};
