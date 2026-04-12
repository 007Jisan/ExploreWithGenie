const mongoose = require('mongoose');

// Eshita's Task: Detailed tourist spot profile + review data model
// Stores full spot details for modal view and embedded user reviews for feedback/points logic.
const spotSchema = new mongoose.Schema(
  {
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

    // Review section: one user can update their own review for the same spot.
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        userName: { type: String, required: true },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: { type: String, required: true },
        date: {
          type: String,
          // Keep a readable date string for quick UI display.
          default: () => new Date().toLocaleDateString(),
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // Automatically keeps createdAt and updatedAt.
);

module.exports = mongoose.model('Spot', spotSchema);
