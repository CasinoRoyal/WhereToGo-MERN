const { check } = require('express-validator');

exports.placeCreateValidator = [
  check('title')
    .not()
    .isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address')
    .not()
    .isEmpty()
];

exports.placeUpdateValidator = [
  check('title')
    .not()
    .isEmpty(),
  check('description').isLength({ min: 5 }),
];