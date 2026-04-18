const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: EMAIL_REGEX,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['tourist', 'agency', 'admin'],
      default: 'tourist',
    },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: '' },
    age: { type: Number, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    budgetPreference: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
    tripDurationPreference: { type: String, default: '' },
    interests: [{ type: String }],
    searchHistory: [{ type: String }],
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    agencyReviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: { type: String, default: '' },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: { type: String, default: '' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function onSave() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
