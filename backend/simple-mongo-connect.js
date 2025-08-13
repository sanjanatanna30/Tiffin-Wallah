const mongoose = require('mongoose');

// MongoDB connection string 
const MONGODB_URI = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/Tiffin?retryWrites=true&w=majority&appName=Practicak';

console.log('Connecting to MongoDB Atlas (Tiffin database)...');
console.log(`Connection string: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(async () => {
  console.log('Connected to MongoDB Atlas successfully!');
  console.log(`Database: ${mongoose.connection.db.databaseName}`);
  console.log(`MongoDB Host: ${mongoose.connection.host}`);
  
  // Define a simple user schema
  const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    role: String,
    createdAt: Date
  });
  
  // Create a User model
  const User = mongoose.model('User', userSchema);
  
  try {
    // Count users
    const count = await User.countDocuments();
    console.log(`Total users in the database: ${count}`);
    
    // Get all users (limited to 10)
    const users = await User.find().limit(10).select('-password');
    console.log('\nUsers in the database:');
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach(user => {
        console.log(`- ${user.fullName} (${user.email}) - ${user.role}`);
      });
    }
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
  } catch (error) {
    console.error('Error querying database:', error.message);
  }
  
  // Close the connection
  await mongoose.connection.close();
  console.log('\nConnection closed');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  if (err.name === 'MongoServerSelectionError') {
    console.error('\nThis is likely due to:');
    console.error('1. Your IP address is not whitelisted in MongoDB Atlas');
    console.error('2. MongoDB Atlas username or password is incorrect');
    console.error('3. Cluster name or configuration is incorrect');
    console.error('4. Network connectivity issues');
  }
}); 