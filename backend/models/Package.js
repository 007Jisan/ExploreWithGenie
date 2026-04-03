const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, default: '', trim: true },
    hotelPricing: {
      type: String,
      default: 'Standard: 1500 BDT/night, Premium: 4000 BDT/night',
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
