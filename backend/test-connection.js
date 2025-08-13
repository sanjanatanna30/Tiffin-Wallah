const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority&appName=Practicak';

// Detailed connection options
const options = {
  serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
  heartbeatFrequencyMS: 10000,     // Check server health every 10 seconds
  socketTimeoutMS: 45000,          // How long a socket can be idle before closing
  connectTimeoutMS: 30000,         // How long to wait for a connection
  family: 4                        // Use IPv4, skip trying IPv6
};

const testConnection = async () => {
  console.log('Testing MongoDB Atlas connection...');
  console.log(`Connection string: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);
  console.log('Connection options:', JSON.stringify(options, null, 2));

  try {
    // Connect to MongoDB
    console.log('Attempting connection...');
    const connection = await mongoose.connect(MONGODB_URI, options);
    
    console.log('==== CONNECTION SUCCESSFUL ====');
    console.log(`Connected to: ${connection.connection.host}`);
    console.log(`Database name: ${connection.connection.db.databaseName}`);
    console.log(`Connection state: ${connection.connection.readyState}`);
    
    // List all collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('==== CONNECTION ERROR ====');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('This is likely due to:');
      console.error('1. Your IP address is not whitelisted in MongoDB Atlas');
      console.error('2. MongoDB Atlas username or password is incorrect');
      console.error('3. Cluster name or configuration is incorrect');
      console.error('4. Network connectivity issues');
    }
    
    // Additional debugging information
    if (error.reason) {
      console.error('Error reason:', error.reason);
    }
    
    return false;
  }
};

// Run the test
testConnection()
  .then(success => {
    console.log(`Connection test ${success ? 'SUCCEEDED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 