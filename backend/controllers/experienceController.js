const Experience = require('../models/Experience');
const User = require('../models/User');

// Eshita's Task: Contribution points for shared travel experiences
// Each valid experience post awards XP and can unlock badges.

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

exports.getExperiences = async (req, res) => {
  try {
    const query = req.query.mine === 'true' ? { user: req.user.id } : {};
    const experiences = await Experience.find(query).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch travel experiences.' });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const { title, story, location } = req.body;
    if (!title || !title.trim() || !story || !story.trim()) {
      return res.status(400).json({ message: 'Title and travel story are required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const experience = await Experience.create({
      user: user._id,
      userName: user.name || 'Traveler',
      title: title.trim(),
      story: story.trim(),
      location: (location || '').trim(),
    });

    // Sharing a travel story is a high-value contribution in Module 3.
    user.points = (Number(user.points) || 0) + 15;
    const awardedBadges = awardBadges(user);
    await user.save();

    res.status(201).json({
      message: awardedBadges.length
        ? `Travel experience shared. New badge earned: ${awardedBadges.join(', ')}`
        : 'Travel experience shared successfully. +15 XP earned.',
      experience,
      totalPoints: user.points,
      awardedBadges,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to share travel experience.' });
  }
};
