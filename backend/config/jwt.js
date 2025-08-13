const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  // Use environment variable with fallback
  const JWT_SECRET = process.env.JWT_SECRET || 'tiffinwallahsecret123';
  
  // Log the token generation (without showing the secret)
  console.log(`Generating JWT token for user ID: ${id}`);
  
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken; 