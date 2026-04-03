const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['tourist', 'agency', 'admin'], 
    default: 'tourist' 
  },

  // 🛡️ Agency Verification (Jisan's Requirement)
  // নতুন এজেন্সিরা ডিফল্টভাবে false থাকবে, এডমিন ভেরিফাই করলে true হবে।
  isVerified: { type: Boolean, default: false },

  // 🎒 Module 1: Profile Details (Sujan's Task)
  profilePicture: { type: String, default: '' }, 
  age: { type: Number, default: null },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },

  // 🤖 Module 2: AI & Recommendation (Jisan/Eshita's Task)
  budgetPreference: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
  tripDurationPreference: { type: String, default: '' }, 
  interests: [{ type: String }], // যেমন: ['Hiking', 'Beach', 'History']
  searchHistory: [{ type: String }], 

  // 🏆 Module 3: Rewards & Leaderboard (Eshita's Task)
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
}, { 
  timestamps: true // এটি অটোমেটিক createdAt এবং updatedAt যোগ করবে
});

// 🟢 পাসওয়ার্ড হ্যাশিং লজিক (Save করার আগে)
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// পাসওয়ার্ড চেক করার মেথড
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
