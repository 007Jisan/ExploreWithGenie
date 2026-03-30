const express = require('express');
const router = express.Router();

// কন্ট্রোলার ইমপোর্ট করা
const { 
  getAdminStats, 
  getAllUsers, 
  getAllSpots,
  getAllExperiences,
  createSpot,
  updateSpot,
  deleteSpot,
  verifyAgency, 
  deleteReview,
  deleteExperience,
} = require('../controllers/adminController');

// মিডলওয়্যার ইমপোর্ট করা (অবজেক্ট আকারে)
const { protect, isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// 🛡️ Admin Panel Routes (Sujan & Jisan)
// ==========================================

// ১. ড্যাশবোর্ড স্ট্যাটাস দেখা (Users, Agencies, Reviews count)
router.get('/stats', protect, isAdmin, getAdminStats);

// ২. সব ইউজার এবং এজেন্সির লিস্ট দেখা (Admin Table এর জন্য)
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/spots', protect, isAdmin, getAllSpots);
router.get('/experiences', protect, isAdmin, getAllExperiences);
router.post('/spots', protect, isAdmin, createSpot);
router.put('/spots/:id', protect, isAdmin, updateSpot);
router.delete('/spots/:id', protect, isAdmin, deleteSpot);

// ৩. এজেন্সিকে ভেরিফাই করা (Jisan's Requirement)
// এডমিন এই রুটে PUT রিকোয়েস্ট পাঠিয়ে এজেন্সিকে 'isVerified: true' করবে
router.put('/verify-agency/:id', protect, isAdmin, verifyAgency);

// ৪. ইনঅ্যাপ্রোপ্রিয়েট রিভিউ রিমুভ করা (Sujan's Requirement)
router.delete('/review/:spotId/:reviewId', protect, isAdmin, deleteReview);
router.delete('/experiences/:id', protect, isAdmin, deleteExperience);

module.exports = router;
