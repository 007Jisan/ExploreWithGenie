const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");

// POST review
router.post("/", addReview);

// GET reviews
router.get("/", getReviews);

module.exports = router;