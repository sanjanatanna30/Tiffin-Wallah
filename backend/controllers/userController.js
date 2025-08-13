const User = require('../models/User');
const generateToken = require('../config/jwt');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, role } = req.body;

    console.log('Registering user:', { fullName, email, phone, address, role });

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Handle in-memory case
    let userData = {
      fullName,
      email,
      password,
      phone,
      address,
      role: role || 'customer'
    };
    
    // For in-memory DB, handle password hashing
    if (global.users) {
      console.log('Using in-memory database for user registration');
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Create user
    console.log('Creating user in database');
    const user = await User.create(userData);

    if (user) {
      console.log('User registered successfully:', user._id);
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          fullName: user.fullName || user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    // Check for user - we need to include the password for verification
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Handle legacy users that might not have a password
    if (!user.password) {
      console.log('User exists but has no password (legacy user):', email);
      return res.status(401).json({
        success: false,
        error: 'This account needs to be migrated. Please use the password reset feature.'
      });
    }

    // Check if password matches
    let isMatch;
    
    if (global.users) {
      // For in-memory DB
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // For MongoDB
      isMatch = await user.matchPassword(password);
    }

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    console.log('User logged in successfully:', user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.name = req.body.fullName || user.name; // Update both name fields
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName || updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 