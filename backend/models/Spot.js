const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: String,
  mainImage: String,
  sliderImages: [String], // স্লাইডারের জন্য ছবির অ্যারে
  location: String,
  mapQuery: String,
  description: String,
  bestVisitingTime: String,
  estimatedBudget: String,
  nearbyHotels: String,
  safetyTips: String,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model('Spot', spotSchema);