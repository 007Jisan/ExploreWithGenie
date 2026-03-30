const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true, trim: true },
    hotelPricing: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
