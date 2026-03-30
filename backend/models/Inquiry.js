const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'replied'],
      default: 'pending',
    },
    replyMessage: { type: String, default: '', trim: true },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
