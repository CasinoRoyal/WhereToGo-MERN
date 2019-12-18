const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

exports.protect = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Auth error', 403));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { id: decodedToken.id };
    next();
  } catch (err) {
    console.log(err)
    return next(new HttpError('Auth error', 403));
  };
};