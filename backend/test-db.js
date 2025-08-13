const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority&appName=Practicak');

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Test inserting a document
    const testSchema = new mongoose.Schema({
      name: String,
      email: String,
      date: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', testSchema);
    
    const testDoc = new Test({
      name: 'Test User',
      email: 'test@example.com'
    });
    
    await testDoc.save();
    console.log('Test document inserted successfully');
    
    // Get all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB(); 