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
const { protect } = require("../middlewares/protect");
const fileUpload = require("../middlewares/file-upload");

const router = express.Router();

router
  .route("/:placeId")
  .get(getPlaceById)
  .patch(protect, placeUpdateValidator, runValidation, updatePlace)
  .delete(protect, deletePlace);

router.get("/user/:userId", getPlacesByUserId);
router.post(
  "/",
  fileUpload.single("image"),
  protect,
  placeCreateValidator,
  runValidation,
  createPlace
);

module.exports = router;
