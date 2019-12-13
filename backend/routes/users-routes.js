const express = require("express");
const HttpError = require("../models/http-error");
const { signup, signin, getAllUsers } = require("../controllers/user-controller");
const { signupValidator} = require("../validators/user-validator");
const { runValidation } = require("../validators/runValidate");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signupValidator, runValidation, signup);
router.post("/signin", signin);

module.exports = router;