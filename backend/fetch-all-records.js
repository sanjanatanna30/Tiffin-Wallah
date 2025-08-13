const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');
const Order = require('./models/Order');

// Function to fetch all records from database
const fetchAllRecords = async () => {
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    const connected = await connectDB();

    if (!connected) {
      console.error('Failed to connect to MongoDB. Check your connection settings.');
      process.exit(1);
    }

    console.log('MongoDB connection successful');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log('Fetching all records...\n');

    // Fetch all users
    console.log('USERS:');
    const users = await User.find({});
    console.log(`Total Users: ${users.length}`);
    console.log(JSON.stringify(users, null, 2));
    console.log('\n-----------------------------------\n');

    // Fetch all food items
    console.log('FOOD ITEMS:');
    const foodItems = await FoodItem.find({});
    console.log(`Total Food Items: ${foodItems.length}`);
    console.log(JSON.stringify(foodItems, null, 2));
    console.log('\n-----------------------------------\n');

    // Fetch all orders
    console.log('ORDERS:');
    const orders = await Order.find({});
    console.log(`Total Orders: ${orders.length}`);
    console.log(JSON.stringify(orders, null, 2));
    console.log('\n-----------------------------------\n');

    // Summary of records
    console.log('DATABASE SUMMARY:');
    console.log(`Database Name: ${mongoose.connection.db.databaseName}`);
    console.log(`Users: ${users.length}`);
    console.log(`Food Items: ${foodItems.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log(`Total Records: ${users.length + foodItems.length + orders.length}`);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error fetching records:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
fetchAllRecords(); 