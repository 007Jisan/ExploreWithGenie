const express = require('express');
const router = express.Router();

const {
  addPackage,
  getAgencyPackages,
  updatePackage,
  deletePackage,
  getInquiries,
  replyToInquiry,
  getPublicPackages,
  createInquiry,
  getMyInquiries,
  createAgencyReview,
} = require('../controllers/agencyController');
const {
  protect,
  isVerifiedAgency,
  isAgency,
  isTourist,
} = require('../middleware/authMiddleware');

router.post('/add-package', protect, isVerifiedAgency, addPackage);
router.get('/packages', protect, isAgency, getAgencyPackages);
router.put('/packages/:id', protect, isVerifiedAgency, updatePackage);
router.delete('/packages/:id', protect, isVerifiedAgency, deletePackage);
router.get('/inquiries', protect, isAgency, getInquiries);
router.post('/inquiries/:id/reply', protect, isAgency, replyToInquiry);
router.get('/public-packages', getPublicPackages);
router.post('/public-inquiries', protect, isTourist, createInquiry);
router.get('/my-inquiries', protect, isTourist, getMyInquiries);
router.post('/public-review', protect, isTourist, createAgencyReview);

module.exports = router;
