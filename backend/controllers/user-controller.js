const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const { name, email, password, image } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return next(new HttpError('User with that email already exist', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      places: [],
      image: image || ''
    });
    await newUser.save();

    const token = jwt.sign(
      {id: newUser._id, email: newUser.email}, 
      process.env.JWT_SECRET_KEY,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.status(201).json({
      status: 'success',
      token,
      user: {
        _id: newUser._id, 
        email: newUser.email, 
        name: newUser.name
      }
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new HttpError('Email and/or password are wrong', 401));
    }

    const token = jwt.sign(
      {id: user._id, email: user.email}, 
      process.env.JWT_SECRET_KEY,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );    

    res.status(200).json({
      status: 'success',
      token,
      user: {
        _id: user._id, 
        email: user.email, 
        name: user.name        
      }
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