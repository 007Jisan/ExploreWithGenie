const Package = require('../models/Package');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

const BADGE_RULES = [
  { threshold: 30, badge: 'Bronze Traveler' },
  { threshold: 60, badge: 'Silver Traveler' },
  { threshold: 100, badge: 'Gold Traveler' },
];

const awardBadges = (user) => {
  if (!Array.isArray(user.badges)) {
    user.badges = [];
  }

  const awardedBadges = [];
  BADGE_RULES.forEach(({ threshold, badge }) => {
    if ((user.points || 0) >= threshold && !user.badges.includes(badge)) {
      user.badges.push(badge);
      awardedBadges.push(badge);
    }
  });

  return awardedBadges;
};

exports.addPackage = async (req, res) => {
  try {
    const { title, description, price, duration, hotelPricing, location } = req.body;

    if (!title || !description || !price || !duration || !location) {
      return res.status(400).json({ message: 'Please fill in all required package fields.' });
    }

    const newPackage = new Package({
      agency: req.user.id,
      agencyId: req.user.id,
      title,
      description,
      price: Number(price),
      duration,
      hotelPricing,
      location,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAgencyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      $or: [{ agency: req.user.id }, { agencyId: req.user.id }],
    }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const { title, description, price, duration, hotelPricing, location } = req.body;

    if (!title || !description || !price || !duration || !location) {
      return res.status(400).json({ message: 'Please fill in all required package fields.' });
    }

    const updatedPackage = await Package.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ agency: req.user.id }, { agencyId: req.user.id }],
      },
      {
        agency: req.user.id,
        agencyId: req.user.id,
        title,
        description,
        price: Number(price),
        duration,
        hotelPricing,
        location,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    res.json(updatedPackage);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findOneAndDelete({
      _id: req.params.id,
      $or: [{ agency: req.user.id }, { agencyId: req.user.id }],
    });

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    await Inquiry.deleteMany({ package: deletedPackage._id });
    res.json({ message: 'Package deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ agency: req.user.id })
      .populate('user', 'name email')
      .populate('package', 'title location')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.replyToInquiry = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ message: 'Reply message is required.' });
    }

    const inquiry = await Inquiry.findOne({
      _id: req.params.id,
      agency: req.user.id,
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    inquiry.replyMessage = replyMessage.trim();
    inquiry.status = 'replied';
    inquiry.repliedAt = new Date();
    await inquiry.save();

    res.json({ message: 'Reply sent successfully.', inquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPublicPackages = async (req, res) => {
  try {
    const query = {};
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    const packages = await Package.find(query)
      .populate('agency', 'name profilePicture agencyReviews isVerified')
      .populate('agencyId', 'name profilePicture agencyReviews isVerified')
      .sort({ createdAt: -1 });

    const normalizedPackages = packages
      .map((pkg) => {
        const packageObject = pkg.toObject();
        const normalizedAgency = packageObject.agency || packageObject.agencyId;

        return {
          ...packageObject,
          agency: normalizedAgency,
          agencyId: normalizedAgency,
        };
      })
      .filter((pkg) => pkg.agency?._id && pkg.agency.isVerified !== false);

    res.json(normalizedPackages);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createInquiry = async (req, res) => {
  try {
    const { packageId, message } = req.body;
    if (!packageId || !message || !message.trim()) {
      return res.status(400).json({ message: 'Package and message are required.' });
    }

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const inquiry = await Inquiry.create({
      package: selectedPackage._id,
      agency: selectedPackage.agency || selectedPackage.agencyId,
      user: user._id,
      userName: user.name,
      message: message.trim(),
    });

    res.status(201).json({ message: 'Inquiry sent successfully.', inquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .populate('agency', 'name')
      .populate('package', 'title location')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createAgencyReview = async (req, res) => {
  try {
    const { agencyId, rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (!agencyId || !parsedRating || !comment || !comment.trim()) {
      return res.status(400).json({ message: 'Agency, rating and comment are required.' });
    }

    const agency = await User.findById(agencyId);
    if (!agency || agency.role !== 'agency') {
      return res.status(404).json({ message: 'Agency not found.' });
    }

    const hasExistingReview = (agency.agencyReviews || []).some(
      (review) => String(review.user) === String(req.user.id)
    );

    if (hasExistingReview) {
      return res.status(400).json({ message: 'You have already reviewed this agency.' });
    }

    const tourist = await User.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    const newReview = {
      user: tourist._id,
      userName: tourist.name || 'Traveler',
      rating: parsedRating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    if (!Array.isArray(agency.agencyReviews)) {
      agency.agencyReviews = [];
    }

    agency.agencyReviews.unshift(newReview);
    tourist.points = (Number(tourist.points) || 0) + 10;
    const awardedBadges = awardBadges(tourist);

    await agency.save();
    await tourist.save();

    res.status(201).json({
      message: awardedBadges.length
        ? `Agency review submitted. New badge earned: ${awardedBadges.join(', ')}`
        : 'Agency review submitted successfully. +10 XP earned.',
      newReview: agency.agencyReviews[0],
      totalPoints: tourist.points,
      awardedBadges,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
