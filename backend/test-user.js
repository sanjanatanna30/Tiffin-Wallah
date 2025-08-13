const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Define User schema (same as in your models)
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name']
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
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  address: {
    type: String,
    required: [true, 'Please provide your address']
  },
  role: {
    type: String,
    enum: ['customer', 'provider'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB and add a test user
const connectAndAddUser = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect('mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority&appName=Practicak', {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.fullName);
    } else {
      // Create a test user
      const testUser = new User({
        fullName: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Test Street, Test City',
        role: 'customer'
      });
      
      await testUser.save();
      console.log('Test user created successfully!');
    }
    
    // List all users
    const users = await User.find().select('-password');
    console.log('All users:', users);
    
    // Get all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

connectAndAddUser(); 