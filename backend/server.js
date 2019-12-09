const express = require('express');
const morgan = require('morgan');

const placesRoute = require('./routes/places-routes');
const usersRoute = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/places', placesRoute);
//app.use('/users', usersRoute);
app.use((req, res, next) => {
  return next(new HttpError(404, 'Page not found'))
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  return res
    .status(error.statusCode || 500)
    .json({ message: error.message || 'Something went wrong, sorry'});
});

app.listen(8000, () => {
  console.log("Server running on port 8000")
})