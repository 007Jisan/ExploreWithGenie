const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  touristName: { type: String, default: '', trim: true },
  touristEmail: { type: String, default: '', trim: true },
  travelerNotification: { type: String, default: '', trim: true },
  travelerNotifiedAt: { type: Date, default: null },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
