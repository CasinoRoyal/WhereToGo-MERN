const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./db");
const placesRoute = require("./routes/places-routes");
const usersRoute = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use("/api/places", placesRoute);
app.use('/api/users', usersRoute);
app.use((req, res, next) => {
  return next(new HttpError("Page not found", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  return res
    .status(error.statusCode || 500)
    .json({ message: error.message || "Something went wrong, sorry" });
});

connectDB();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port} port`);
});
