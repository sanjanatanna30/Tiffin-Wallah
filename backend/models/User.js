const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Support both fullName and name fields
  fullName: {
    type: String,
    required: function() {
      return !this.name; // Only required if name is not provided
    }
  },
  name: {
    type: String,
    required: function() {
      return !this.fullName; // Only required if fullName is not provided
    }
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Make password required only for new users
      return this.isNew; 
    },
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: function() {
      // Only require phone for customer or provider roles
      return ['customer', 'provider'].includes(this.role);
    }
  },
  address: {
    type: String,
    required: function() {
      // Only require address for customer or provider roles
      return ['customer', 'provider'].includes(this.role);
    }
  },
  role: {
    type: String,
    enum: ['customer', 'provider', 'librarian', 'member'], // Support both tiffin and library roles
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure at least one name field has a value
userSchema.pre('validate', function(next) {
  if (!this.fullName && !this.name) {
    this.invalidate('fullName', 'Either fullName or name is required');
  }
  next();
});

// Map name field to fullName if only one exists
userSchema.pre('save', function(next) {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  } else if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
  next();
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  // If user has no password (legacy users from another system)
  if (!this.password) {
    return false;
  }
  
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual getter to ensure we always have a consistent name property
userSchema.virtual('displayName').get(function() {
  return this.fullName || this.name;
});

module.exports = mongoose.model('User', userSchema); 