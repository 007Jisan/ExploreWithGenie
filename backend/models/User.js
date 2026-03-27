const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'agency', 'admin'], default: 'tourist' },
  
  // 🔥 ড্যাশবোর্ডের জন্য আগের ফিল্ডগুলো
  age: { type: Number, default: null },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },

  // 🎯 নতুন যোগ করা হলো: এশিতার Recommendation System-এর জন্য
  budgetPreference: { type: String, default: '' }, // যেমন: 'Low', 'Medium', 'High'
  tripDurationPreference: { type: String, default: '' }, // যেমন: 'Short', 'Medium', 'Long'
  searchHistory: [{ type: String }] // ইউজার আগে কী কী সার্চ করেছে তার লিস্ট
});

// 🟢 পাসওয়ার্ড হ্যাশিং লজিক (ফিক্স করা হয়েছে: next() এবং এরর বাদ দেওয়া হয়েছে)
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return; 
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);