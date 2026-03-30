const User = require('../models/User');

exports.addPoints = async (req, res) => {
  try {
    // Protiti review er jonne 10 points (Eshita's Task)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points: 10 } },
      { new: true }
    );

    // Achievement Badges logic (Eshita's Task)
    let newBadge = null;
    if (user.points >= 100 && !user.badges.includes('Gold Traveler')) {
      newBadge = 'Gold Traveler';
      user.badges.push(newBadge);
      await user.save();
    }

    res.json({ 
      message: "Points added successfully!", 
      totalPoints: user.points,
      newBadge: newBadge 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating points" });
  }
};

