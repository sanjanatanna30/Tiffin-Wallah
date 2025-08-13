const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/Tiffin?retryWrites=true&w=majority&appName=Practicak';

// Define User schema
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
    enum: ['customer', 'provider', 'admin'],
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

// Sample test users
const testUsers = [
  {
    fullName: 'Customer User',
    email: 'customer@tiffinwallah.com',
    password: 'customer123',
    phone: '1234567890',
    address: '456 Customer Street, Food City',
    role: 'customer'
  },
  {
    fullName: 'Provider User',
    email: 'provider@tiffinwallah.com',
    password: 'provider123',
    phone: '9876543210',
    address: '789 Provider Road, Food City',
    role: 'provider'
  },
  {
    fullName: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    phone: '5551234567',
    address: '123 Main St, Anytown, USA',
    role: 'customer'
  },
  {
    fullName: 'Priya Patel',
    email: 'priya@tiffinservice.com',
    password: 'tiffin123',
    phone: '5559876543',
    address: '456 Spice Avenue, Flavor Town',
    role: 'provider'
  }
];

// Create test users in Tiffin database
const createTestUsers = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB with Tiffin database
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    
    // Create User model
    const User = mongoose.model('User', userSchema);
    
    // Add test users
    console.log('Adding test users...');
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
      } else {
        // Create new user
        const user = await User.create(userData);
        console.log(`User created: ${user.fullName} (${user.email}) - ${user.role}`);
      }
    }
    
    // List all users
    const users = await User.find().select('-password');
    console.log('\nAll users in the database:');
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - ${user.role}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    
    return true;
  } catch (error) {
    console.error('Error adding test users:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('This may be due to network connectivity issues or IP whitelist restrictions.');
      console.error('Please make sure your IP is added to MongoDB Atlas whitelist.');
    }
    return false;
  }
};

// Run the function
createTestUsers()
  .then(success => {
    console.log(`Operation ${success ? 'completed successfully' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 