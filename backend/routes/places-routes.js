const express = require("express");
const HttpError = require("../models/http-error");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
} = require("../controllers/place-controller");
const {
  placeCreateValidator,
  placeUpdateValidator
} = require("../validators/place-validator");
const { runValidation } = require("../validators/runValidate");

const router = express.Router();

router
  .route("/:placeId")
  .get(getPlaceById)
  .patch(placeUpdateValidator, runValidation, updatePlace)
  .delete(deletePlace);

router.post("/", placeCreateValidator, runValidation, createPlace);
router.get("/user/:userId", getPlacesByUserId);

module.exports = router;