const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// ১. সাইনআপ লজিক (তোমার আগের কোড)
// ==========================================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully ✅' });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: 'Server Error: Check if all fields are correct' });
  }
};

// ==========================================
// ২. লগইন লজিক (তোমার আগের কোড)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: 'Server Error during Login' });
  }
};

// ==========================================
// ৩. নতুন: প্রোফাইল দেখার লজিক (GET)
// ==========================================
exports.getProfile = async (req, res) => {
  try {
    // পাসওয়ার্ড বাদে ইউজারের বাকি সব ডাটা ডাটাবেস থেকে আনবে
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================================
// ৪. নতুন: প্রোফাইল আপডেট/এডিট করার লজিক (PUT)
// ==========================================
exports.updateProfile = async (req, res) => {
  try {
    const { name, age, phone, address, bio } = req.body;
    
    // ডাটাবেসে ইউজারের ডাটা আপডেট করবে
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, age, phone, address, bio } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ message: 'Server Error during update' });
  }
};