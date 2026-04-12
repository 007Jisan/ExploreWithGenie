const User = require('../models/User');
const Spot = require('../models/Spot');
const Experience = require('../models/Experience');
const jwt = require('jsonwebtoken');
const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Eshita's Task: Recommendation + rewards + monthly leaderboard pipeline
// This controller handles:
// 1) personalized recommendations based on stored user preferences
// 2) review submission with point updates
// 3) leaderboard calculation from monthly/all-time activity

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
    if (user.points >= threshold && !user.badges.includes(badge)) {
      user.badges.push(badge);
      awardedBadges.push(badge);
    }
  });

  return awardedBadges;
};

const parseBudgetValue = (budgetText = '') => {
  const digits = String(budgetText).replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
};

const CATEGORY_INTEREST_MAP = {
  historical: 'Historical',
  history: 'Historical',
  natural: 'Natural',
  nature: 'Natural',
  popular: 'Popular',
};

const getSelectedCategories = (interests = []) => {
  return [...new Set(
    (Array.isArray(interests) ? interests : [])
      .map((interest) => CATEGORY_INTEREST_MAP[String(interest).trim().toLowerCase()])
      .filter(Boolean)
  )];
};

const getRecommendationScore = (spot, preferences) => {
  let score = 0;
  const budget = parseBudgetValue(spot.estimatedBudget);
  const interests = Array.isArray(preferences.interests) ? preferences.interests : [];
  const history = Array.isArray(preferences.searchHistory) ? preferences.searchHistory : [];
  const textBlob = `${spot.name} ${spot.location} ${spot.description}`.toLowerCase();

  if (preferences.budgetPreference === 'Low' && budget !== null && budget <= 3000) score += 3;
  if (preferences.budgetPreference === 'Medium' && budget !== null && budget > 3000 && budget <= 7000) score += 3;
  if (preferences.budgetPreference === 'High' && budget !== null && budget > 7000) score += 3;

  if (preferences.tripDurationPreference === '1 Day' && budget !== null && budget <= 2500) score += 2;
  if (preferences.tripDurationPreference === '1-3 Days' && budget !== null && budget <= 7000) score += 2;
  if (preferences.tripDurationPreference === '4+ Days' && budget !== null && budget >= 5000) score += 2;

  interests.forEach((interest) => {
    if (textBlob.includes(String(interest).toLowerCase())) {
      score += 2;
    }
  });

  history.forEach((item) => {
    const term = String(item).toLowerCase();
    if (term && textBlob.includes(term)) {
      score += 1;
    }
  });

  if (Array.isArray(spot.reviews) && spot.reviews.length > 0) {
    score += Math.min(spot.reviews.length, 5);
  }

  return score;
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: role || 'tourist',
      points: 0,
      badges: [],
    });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.findOne({
        email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: 'i' },
      });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(String(password || ''));
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      user: { id: user._id, name: user.name, role: user.role },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '1d',
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login Error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'age',
      'phone',
      'address',
      'bio',
      'budgetPreference',
      'tripDurationPreference',
      'interests',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.searchHistory) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const nextHistory = Array.isArray(user.searchHistory) ? [...user.searchHistory] : [];
      const term = String(req.body.searchHistory).trim();
      if (term) {
        const withoutDuplicate = nextHistory.filter(
          (item) => item.toLowerCase() !== term.toLowerCase()
        );
        updates.searchHistory = [term, ...withoutDuplicate].slice(0, 10);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: 'Update Error' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    return res.json({ imageUrl: user.profilePicture, user });
  } catch (err) {
    return res.status(500).json({ message: 'Upload Error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'tourist' }).select('-password').lean();
    const spots = await Spot.find().select('reviews').lean();
    const experiences = await Experience.find().select('user createdAt').lean();
    const usersWithAgencyReviews = await User.find({ role: 'agency' })
      .select('agencyReviews')
      .lean();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyReviewMap = new Map();
    const monthlyExperienceMap = new Map();
    const allTimeReviewMap = new Map();
    const allTimeExperienceMap = new Map();

    // Collect both all-time and current-month review activity from tourist spot reviews.
    spots.forEach((spot) => {
      (spot.reviews || []).forEach((review) => {
        const key = String(review.user || '');
        if (!key) return;

        allTimeReviewMap.set(key, (allTimeReviewMap.get(key) || 0) + 1);

        const createdAt = new Date(review.createdAt || review.date || Date.now());
        if (Number.isNaN(createdAt.getTime()) || createdAt < monthStart) return;

        monthlyReviewMap.set(key, (monthlyReviewMap.get(key) || 0) + 1);
      });
    });

    // Agency review activity also contributes to user leaderboard points.
    usersWithAgencyReviews.forEach((agency) => {
      (agency.agencyReviews || []).forEach((review) => {
        const key = String(review.user || '');
        if (!key) return;

        allTimeReviewMap.set(key, (allTimeReviewMap.get(key) || 0) + 1);

        const createdAt = new Date(review.createdAt || Date.now());
        if (Number.isNaN(createdAt.getTime()) || createdAt < monthStart) return;

        monthlyReviewMap.set(key, (monthlyReviewMap.get(key) || 0) + 1);
      });
    });

    // Travel experiences count as a higher-value contribution.
    experiences.forEach((experience) => {
      const key = String(experience.user || '');
      if (!key) return;

      allTimeExperienceMap.set(key, (allTimeExperienceMap.get(key) || 0) + 1);

      const createdAt = new Date(experience.createdAt || Date.now());
      if (Number.isNaN(createdAt.getTime()) || createdAt < monthStart) return;

      monthlyExperienceMap.set(key, (monthlyExperienceMap.get(key) || 0) + 1);
    });

    // Keep persisted points and badges aligned with the same all-time activity source used everywhere else.
    const syncOps = [];
    topUsers.forEach((user) => {
      const key = String(user._id);
      const computedPoints =
        (allTimeReviewMap.get(key) || 0) * 10 + (allTimeExperienceMap.get(key) || 0) * 15;
      const nextBadges = BADGE_RULES
        .filter(({ threshold }) => computedPoints >= threshold)
        .map(({ badge }) => badge);

      if (
        computedPoints !== (user.points || 0) ||
        JSON.stringify(nextBadges) !== JSON.stringify(user.badges || [])
      ) {
        user.points = computedPoints;
        user.badges = nextBadges;

        syncOps.push({
          updateOne: {
            filter: { _id: user._id },
            update: { $set: { points: computedPoints, badges: nextBadges } },
          },
        });
      }
    });

    if (syncOps.length) {
      await User.bulkWrite(syncOps);
    }

    const rankedUsers = topUsers
      .map((user) => {
        const key = String(user._id);
        const monthlyPoints =
          (monthlyReviewMap.get(key) || 0) * 10 + (monthlyExperienceMap.get(key) || 0) * 15;

        return {
          ...user,
          monthlyPoints,
          leaderboardPoints: user.points || 0,
        };
      })
      .filter((user) => user.role === 'tourist')
      .sort((a, b) => {
        if (b.leaderboardPoints !== a.leaderboardPoints) {
          return b.leaderboardPoints - a.leaderboardPoints;
        }
        if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
      .slice(0, 10);

    return res.json(rankedUsers);
  } catch (err) {
    return res.status(500).json({ message: 'Leaderboard Error' });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points = (Number(user.points) || 0) + 10;
    const newBadges = awardBadges(user);
    await user.save();

    return res.json({ totalPoints: user.points, newBadges });
  } catch (err) {
    return res.status(500).json({ message: 'Points Error' });
  }
};

exports.addReviewAndPoints = async (req, res) => {
  try {
    const { spotId, rating, comment } = req.body;
    const userId = req.user?._id || req.user?.id;
    const parsedRating = Number(rating);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized review request.' });
    }

    if (!spotId || !parsedRating || !comment || !comment.trim()) {
      return res.status(400).json({ message: 'Spot, rating and comment are required.' });
    }

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found in database.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!Array.isArray(spot.reviews)) {
      spot.reviews = [];
    }

    const existingReviewIndex = spot.reviews.findIndex(
      (review) => String(review.user) === String(userId)
    );

    const reviewPayload = {
      user: userId,
      userName: user.name || 'Genie Traveler',
      rating: parsedRating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString(),
      createdAt: new Date(),
    };

    let responseMessage = 'Review submitted! +10 XP earned.';
    let awardedBadges = [];

    // Existing review update: keep content fresh but don't double-award points.
    if (existingReviewIndex >= 0) {
      spot.reviews[existingReviewIndex].rating = reviewPayload.rating;
      spot.reviews[existingReviewIndex].comment = reviewPayload.comment;
      spot.reviews[existingReviewIndex].date = reviewPayload.date;
      spot.reviews[existingReviewIndex].createdAt = reviewPayload.createdAt;
      spot.reviews[existingReviewIndex].userName = reviewPayload.userName;
      responseMessage = 'Your review has been updated successfully.';
    } else {
      // First review on this spot by this user: award contribution points.
      spot.reviews.unshift(reviewPayload);
      user.points = (Number(user.points) || 0) + 10;
      awardedBadges = awardBadges(user);
      if (awardedBadges.length) {
        responseMessage = `Congrats! You earned: ${awardedBadges.join(', ')}`;
      }
    }

    await spot.save();
    await user.save();

    const savedReview =
      existingReviewIndex >= 0
        ? spot.reviews[existingReviewIndex]
        : spot.reviews[0];

    return res.status(existingReviewIndex >= 0 ? 200 : 201).json({
      message: responseMessage,
      totalPoints: user.points,
      awardedBadges,
      newReview: savedReview,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

exports.savePreferences = async (req, res) => {
  try {
    const { budgetPreference, tripDurationPreference, interests } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (budgetPreference !== undefined) user.budgetPreference = budgetPreference;
    if (tripDurationPreference !== undefined) user.tripDurationPreference = tripDurationPreference;
    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests.filter(Boolean)
        : String(interests)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    await user.save();
    return res.json({
      message: 'Preferences saved successfully.',
      preferences: {
        budgetPreference: user.budgetPreference,
        tripDurationPreference: user.tripDurationPreference,
        interests: user.interests,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Preferences Error' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'budgetPreference tripDurationPreference interests searchHistory'
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const spots = await Spot.find();
    const selectedCategories = getSelectedCategories(user.interests);
    const candidateSpots =
      selectedCategories.length > 0
        ? spots.filter((spot) => selectedCategories.includes(spot.category || 'Popular'))
        : spots;

    const rankedSpots = candidateSpots
      .map((spot) => ({
        ...spot.toObject(),
        score: getRecommendationScore(spot, user),
      }))
      .sort((a, b) => b.score - a.score);

    res.json(rankedSpots.slice(0, 6));
  } catch (err) {
    res.status(500).json({ message: 'Recommendation Error' });
  }
};
