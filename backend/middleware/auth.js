const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  console.log('Authorization header:', req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from Authorization header');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found, access denied');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Use environment variable with fallback
    const JWT_SECRET = process.env.JWT_SECRET || 'tiffinwallahsecret123';
    
    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified, user ID:', decoded.id);

    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found for token ID:', decoded.id);
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    console.log('User authenticated:', user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied: user role ${req.user.role} not in allowed roles:`, roles);
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    console.log(`Role authorization passed for ${req.user.role}`);
    next();
  };
}; 