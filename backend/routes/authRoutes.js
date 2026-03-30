const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
  getLeaderboard,
  uploadAvatar,
  addPoints,
  addReviewAndPoints,
  savePreferences,
  getRecommendations,
} = require('../controllers/authController');
const {
  getExperiences,
  createExperience,
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `avatar-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/preferences', protect, savePreferences);
router.get('/recommendations', protect, getRecommendations);
router.post('/review', protect, addReviewAndPoints);
router.get('/leaderboard', getLeaderboard);
router.post('/add-points', protect, addPoints);
router.get('/experiences', protect, getExperiences);
router.post('/experiences', protect, createExperience);

module.exports = router;
