const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas Tiffin database...');
    
    // Updated connection string specifying TiffinWallah database
    const uri = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/TiffinWallah?retryWrites=true&w=majority&appName=TiffinWallah';
    
    // MongoDB Atlas connection with updated connection string
    const conn = await mongoose.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 30000
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    return true;
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    if (err.name === 'MongoServerSelectionError') {
      console.error('This may be due to network connectivity issues or IP whitelist restrictions.');
      console.error('Check if your IP is added to MongoDB Atlas whitelist (0.0.0.0/0 should work).');
      if (err.reason) {
        console.error('Error details:', err.reason);
      }
    }
    return false;
  }
};

module.exports = connectDB; 