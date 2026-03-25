const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: String,
  nameBN: String, // 👈 বাংলার জন্য
  mainImage: String,
  sliderImages: [String],
  location: String,
  locationBN: String, // 👈 বাংলার জন্য
  mapQuery: String,
  description: String,
  descriptionBN: String, // 👈 বাংলার জন্য
  bestVisitingTime: String,
  estimatedBudget: String,
  nearbyHotels: String,
  safetyTips: String,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model('Spot', spotSchema);