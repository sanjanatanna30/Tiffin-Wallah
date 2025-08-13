const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');
const Order = require('./models/Order');
const fs = require('fs');
const path = require('path');

// Helper function to format data for display
const formatData = (data, includePassword = false) => {
  return data.map(item => {
    const formattedItem = { ...item._doc };
    // Remove password field for security unless explicitly requested
    if (!includePassword && formattedItem.password) {
      delete formattedItem.password;
    }
    return formattedItem;
  });
};

// Function to save data to a file
const saveToFile = (data, filename) => {
  const outputDir = path.join(__dirname, 'output');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
};

// Connect to database
const connectToDatabase = async () => {
  console.log('Connecting to MongoDB...');
  const connected = await connectDB();

  if (!connected) {
    console.error('Failed to connect to MongoDB. Check your connection settings.');
    return false;
  }

  console.log('MongoDB connection successful');
  console.log(`Database: ${mongoose.connection.db.databaseName}`);
  return true;
};

// Fetch all users
const fetchUsers = async (saveFile = false) => {
  console.log('\nFetching all users...');
  const users = await User.find({});
  console.log(`Total Users: ${users.length}`);
  
  const formattedUsers = formatData(users);
  
  if (saveFile) {
    saveToFile(formattedUsers, 'users.json');
  }
  
  return formattedUsers;
};

// Fetch all food items
const fetchFoodItems = async (saveFile = false) => {
  console.log('\nFetching all food items...');
  const foodItems = await FoodItem.find({});
  console.log(`Total Food Items: ${foodItems.length}`);
  
  const formattedFoodItems = formatData(foodItems);
  
  if (saveFile) {
    saveToFile(formattedFoodItems, 'food_items.json');
  }
  
  return formattedFoodItems;
};

// Fetch all orders
const fetchOrders = async (saveFile = false) => {
  console.log('\nFetching all orders...');
  const orders = await Order.find({});
  console.log(`Total Orders: ${orders.length}`);
  
  const formattedOrders = formatData(orders);
  
  if (saveFile) {
    saveToFile(formattedOrders, 'orders.json');
  }
  
  return formattedOrders;
};

// Fetch everything
const fetchAll = async (saveFile = false) => {
  try {
    if (!(await connectToDatabase())) {
      return;
    }

    const users = await fetchUsers(saveFile);
    const foodItems = await fetchFoodItems(saveFile);
    const orders = await fetchOrders(saveFile);

    console.log('\n----- DATABASE SUMMARY -----');
    console.log(`Database Name: ${mongoose.connection.db.databaseName}`);
    console.log(`Users: ${users.length}`);
    console.log(`Food Items: ${foodItems.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log(`Total Records: ${users.length + foodItems.length + orders.length}`);

    if (saveFile) {
      saveToFile({
        databaseName: mongoose.connection.db.databaseName,
        summary: {
          users: users.length,
          foodItems: foodItems.length,
          orders: orders.length,
          totalRecords: users.length + foodItems.length + orders.length
        },
        users,
        foodItems,
        orders
      }, 'all_records.json');
    }

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error fetching records:', error);
    await mongoose.disconnect();
  }
};

// Parse command line arguments
const handleCommandLineArgs = () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default: fetch everything and display results
    fetchAll(false);
    return;
  }
  
  const saveToFile = args.includes('--save');
  
  if (args.includes('--all')) {
    fetchAll(saveToFile);
    return;
  }
  
  // Process individual collection flags
  (async () => {
    if (!(await connectToDatabase())) {
      return;
    }
    
    try {
      if (args.includes('--users')) {
        await fetchUsers(saveToFile);
      }
      
      if (args.includes('--food')) {
        await fetchFoodItems(saveToFile);
      }
      
      if (args.includes('--orders')) {
        await fetchOrders(saveToFile);
      }
      
      await mongoose.disconnect();
      console.log('\nDatabase connection closed');
    } catch (error) {
      console.error('Error:', error);
      await mongoose.disconnect();
    }
  })();
};

// Check if script is run directly or required as a module
if (require.main === module) {
  console.log('Database Tools Script');
  console.log('--------------------');
  console.log('Usage:');
  console.log('  node db-tools.js                   - Fetch all records and display');
  console.log('  node db-tools.js --save            - Fetch all records and save to files');
  console.log('  node db-tools.js --users           - Fetch only users');
  console.log('  node db-tools.js --food            - Fetch only food items');
  console.log('  node db-tools.js --orders          - Fetch only orders');
  console.log('  node db-tools.js --users --save    - Fetch users and save to file');
  console.log('--------------------\n');
  
  handleCommandLineArgs();
} else {
  // Export functions when used as a module
  module.exports = {
    connectToDatabase,
    fetchUsers,
    fetchFoodItems,
    fetchOrders,
    fetchAll
  };
} 