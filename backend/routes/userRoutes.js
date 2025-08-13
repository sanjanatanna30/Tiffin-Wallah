const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Test MongoDB connection
router.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('../models/User');
    
    if (mongoose.connection.readyState === 1) {
      // Check collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      // Get user count
      const userCount = await User.countDocuments();
      
      res.json({
        success: true,
        message: 'MongoDB Atlas connected successfully!',
        database: mongoose.connection.db.databaseName,
        collections: collectionNames,
        userCount: userCount
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'MongoDB not connected!',
        readyState: mongoose.connection.readyState
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing MongoDB connection',
      error: error.message
    });
  }
});

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router; 