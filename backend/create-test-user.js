const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createTestUser = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const connected = await connectDB();

    if (!connected) {
      console.error('Failed to connect to MongoDB. Check your connection settings.');
      process.exit(1);
    }

    console.log('Creating test user...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create customer user
    const customerUser = {
      fullName: 'Test Customer',
      email: 'customer@test.com',
      password: hashedPassword,
      phone: '1234567890',
      address: '123 Test Street, Test City',
      role: 'customer'
    };

    // Create provider user
    const providerUser = {
      fullName: 'Test Provider',
      email: 'provider@test.com',
      password: hashedPassword,
      phone: '0987654321',
      address: '456 Food Street, Food City',
      role: 'provider'
    };

    // Check if users already exist
    const customerExists = await User.findOne({ email: customerUser.email });
    const providerExists = await User.findOne({ email: providerUser.email });

    if (!customerExists) {
      const newCustomer = await User.create(customerUser);
      console.log(`Customer user created with ID: ${newCustomer._id}`);
    } else {
      console.log('Customer user already exists');
    }

    if (!providerExists) {
      const newProvider = await User.create(providerUser);
      console.log(`Provider user created with ID: ${newProvider._id}`);
    } else {
      console.log('Provider user already exists');
    }

    // List all users
    const users = await User.find({});
    console.log(`Total users in database: ${users.length}`);
    console.log('Users:');
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}): ${user.role}`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

  } catch (error) {
    console.error('Error creating test user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
createTestUser(); 