const express = require('express');
const router = express.Router();

// কন্ট্রোলার এবং মিডলওয়্যার ইম্পোর্ট করা হলো
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); 

// রাউটগুলো
router.post('/signup', signup);
router.post('/login', login);

// প্রোফাইলের জন্য নতুন রাউটগুলো (protect মিডলওয়্যার সহ)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;