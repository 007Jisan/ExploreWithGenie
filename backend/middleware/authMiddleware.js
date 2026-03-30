const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
      const userId = decoded.user ? decoded.user.id : decoded.id || decoded.sub;

      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists, authorization denied' });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid or expired' });
    }
  }

  return res.status(401).json({ message: 'No token, authorization denied' });
};

const isVerifiedAgency = (req, res, next) => {
  if (req.user && req.user.role === 'agency' && req.user.isVerified) {
    return next();
  }

  if (req.user && req.user.role === 'agency') {
    return res.status(403).json({
      message: 'Access denied: your agency is not verified by admin yet.',
    });
  }

  return res.status(403).json({ message: 'Access denied: agency account required.' });
};

const isAgency = (req, res, next) => {
  if (req.user && req.user.role === 'agency') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: agency account required.' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: admin only.' });
};

const isTourist = (req, res, next) => {
  if (req.user && req.user.role === 'tourist') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: tourist account required.' });
};

module.exports = { protect, isVerifiedAgency, isAgency, isAdmin, isTourist };
