const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBN: String, 
  mainImage: { type: String, required: true },
  sliderImages: [String],
  category: {
    type: String,
    enum: ['Natural', 'Historical', 'Popular'],
    default: 'Popular',
  },
  location: { type: String, required: true },
  locationBN: String, 
  mapQuery: String,
  description: { type: String, required: true },
  descriptionBN: String, 
  bestVisitingTime: String,
  estimatedBudget: String,
  nearbyHotels: String,
  safetyTips: String,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  
  // 🔥 রিভিউ সেকশন (Sujan & Eshita Module)
  reviews: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      userName: { type: String, required: true },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: { type: String, required: true },
      date: { 
        type: String, 
        default: () => new Date().toLocaleDateString() // Function হিসেবে দিলে প্রতিবার নতুন তারিখ নিবে
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true }); // createdAt এবং updatedAt অটোমেটিক ট্র্যাক করবে

module.exports = mongoose.model('Spot', spotSchema);
