const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const { name, email, password, image } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return next(new HttpError('User with that email already exist', 400));
    }

    const newUser = new User({
      name,
      email,
      password,
      places: [],
      image: image || ''
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      user: newUser
    })

  } catch(err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }

};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return next(new HttpError('Email and/or password are wrong', 401));
    }

    res.status(200).json({
      status: 'success',
      user
    })

  } catch(err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }

};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    if (!users) {
      return next(new HttpError('We have not any users yet', 404))
    }

    res.status(200).json({
      status: 'success',
      length: users.length,
      users
    });
  } catch(err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));    
  }
};