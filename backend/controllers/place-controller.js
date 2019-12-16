const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const getLocation = require("../utils/location");
 
exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return next(new HttpError("Place not found", 404));
    }
    res.status(200).json({
      message: "success",
      place
    });
  } catch (err) {
    return next(new HttpError("Something went wrong in db", 500));
  }
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const places = await Place.find({ creator: userId });
    if (!places) {
      return next(new HttpError("This user have not any places yet", 404));
    }
    res.status(200).json({
      message: "success",
      length: places.length,
      places
    });
  } catch (err) {
    console.log(err)
    return next(new HttpError("Something went wrong in db", 500));
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const place = new Place({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      location: await getLocation(req.body.address),
      image: req.body.image || '',
      creator: req.body.creator
    });
    const user = await User.findById(req.body.creator);

    if(!user) {
     return next(new HttpError("User not found", 404));
    }

    const sess =  await mongoose.startSession();
    sess.startTransaction();
    await place.save({ session: sess });
    user.places.push(place);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({
      status: 'success',
      place
    })
  } catch (err) {
    console.log(err)
    return next(new HttpError("Something went wrong in db", 500));
  }
};


exports.updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.placeId,{
      title: req.body.title,
      description: req.body.description
    }, { new: true });
    if (!place) {
      return next(new HttpError('Place not found', 404));
    }

    res.status(200).json({
      status: 'success',
      place
    });
  } catch (err) {
    console.log(err)
    return next(new HttpError("Something went wrong in db", 500));
  }
};

exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.placeId).populate('creator');
    if (!place) {
      return next(new HttpError('Place not found', 404));
    }

    const sess =  await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (err) {
    console.log(err)
    return next(new HttpError("Something went wrong in db", 500));
  }
};