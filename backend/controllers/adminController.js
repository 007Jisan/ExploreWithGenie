const User = require('../models/User');
const Spot = require('../models/Spot');
const Experience = require('../models/Experience');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'tourist' });
    const totalAgencies = await User.countDocuments({ role: 'agency' });
    const pendingAgencies = await User.countDocuments({ role: 'agency', isVerified: false });
    const totalExperiences = await Experience.countDocuments();

    const spots = await Spot.find().select('reviews');
    const totalReviews = spots.reduce(
      (sum, spot) => sum + (Array.isArray(spot.reviews) ? spot.reviews.length : 0),
      0
    );

    res.json({
      totalUsers,
      totalAgencies,
      pendingAgencies,
      totalReviews,
      totalExperiences,
      totalSpots: spots.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user list' });
  }
};

exports.getAllSpots = async (req, res) => {
  try {
    const spots = await Spot.find().sort({ createdAt: -1 });
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching spots' });
  }
};

exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching travel experiences' });
  }
};

exports.createSpot = async (req, res) => {
  try {
    const requiredFields = ['name', 'mainImage', 'location', 'description', 'lat', 'lng'];
    const missingField = requiredFields.find((field) => req.body[field] === undefined || req.body[field] === '');

    if (missingField) {
      return res.status(400).json({ message: `${missingField} is required.` });
    }

    const spot = await Spot.create(req.body);
    res.status(201).json(spot);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create spot' });
  }
};

exports.updateSpot = async (req, res) => {
  try {
    const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSpot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    res.json(updatedSpot);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update spot' });
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    const deletedSpot = await Spot.findByIdAndDelete(req.params.id);

    if (!deletedSpot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    res.json({ message: 'Spot removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete spot' });
  }
};

exports.verifyAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.role !== 'agency') {
      return res.status(404).json({ message: 'Agency not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: `Agency '${user.name}' is now verified.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { spotId, reviewId } = req.params;

    const updatedSpot = await Spot.findByIdAndUpdate(
      spotId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!updatedSpot) {
      return res.status(404).json({ message: 'Spot or review not found' });
    }

    res.json({ message: 'Review removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove review' });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);

    if (!deletedExperience) {
      return res.status(404).json({ message: 'Travel experience not found.' });
    }

    res.json({ message: 'Travel experience removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove travel experience' });
  }
};
