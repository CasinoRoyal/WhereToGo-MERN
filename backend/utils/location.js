const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.MAP_KEY;

const getLocation = async address => {
  try{
    const res = await axios(`
      https://geocoder.ls.hereapi.com/6.2/geocode.json?apikey=${API_KEY}&searchtext=${encodeURIComponent(address)}`
    );
    return res.data.Response.View[0].Result[0].Location.DisplayPosition;
  } catch(err){
    console.log(err)
  }
};

module.exports = getLocation;