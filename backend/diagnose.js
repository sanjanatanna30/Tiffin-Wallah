const mongoose = require('mongoose');
const connectDB = require('./config/db');

console.log('Starting MongoDB Atlas connection diagnostic');
console.log('Current directory:', process.cwd());
console.log('Node.js version:', process.version);
console.log('MongoDB driver version:', require('mongoose/package.json').version);

// Check if the MongoDB URI includes the database name
const MONGODB_URI = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/Tiffin?retryWrites=true&w=majority&appName=Practicak';
console.log('MongoDB URI includes database name:', MONGODB_URI.includes('/Tiffin?'));

// Test the connection
console.log('\nTesting MongoDB connection...');
connectDB()
  .then(async (connected) => {
    console.log('Connection result:', connected);
    
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB Atlas Connected!');
      console.log('Database:', mongoose.connection.db.databaseName);
      console.log('Host:', mongoose.connection.host);
      
      // Check collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:');
      collections.forEach(coll => console.log(`- ${coll.name}`));
      
      // Close the connection
      await mongoose.connection.close();
      console.log('Connection closed');
    } else {
      console.log('Connection state:', mongoose.connection.readyState);
      console.log('Connection not established, readyState =', mongoose.connection.readyState);
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    }
  })
  .catch(err => {
    console.error('Error during connection test:', err.message);
  }); 