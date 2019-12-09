const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello!'));

module.exports = router;