const { check } = require('express-validator');

exports.signupValidator = [
  check('name')
    .not()
    .isEmpty(),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password').isLength({ min: 6 })
];