const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(`${errors.array()[0].msg} in ${errors.array()[0].param}`, 422)
    );
  }

  next();
};