const Review = require("../models/Review");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};