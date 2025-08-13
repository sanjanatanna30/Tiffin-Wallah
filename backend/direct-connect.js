const { MongoClient } = require('mongodb');

// Direct MongoDB connection using the MongoDB driver
async function testDirectConnection() {
  // Connection URI
  const uri = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority&appName=Practicak';
  
  // Connection options
  const options = {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 5,
    family: 4
  };
  
  // Create a new MongoClient
  const client = new MongoClient(uri, options);
  
  try {
    console.log('Attempting direct connection to MongoDB Atlas...');
    
    // Connect to the MongoDB cluster
    await client.connect();
    
    console.log('Connected successfully to MongoDB Atlas');
    
    // Get list of databases
    const databasesList = await client.db().admin().listDatabases();
    
    console.log('\nAvailable databases:');
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Connect to the Tiffin database
    const db = client.db('Tiffin');
    
    // List collections in the Tiffin database
    const collections = await db.listCollections().toArray();
    
    console.log('\nCollections in Tiffin database:');
    if (collections.length === 0) {
      console.log('No collections found');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // If users collection exists, get count
    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\nTotal users: ${usersCount}`);
      
      // Get sample users
      const users = await db.collection('users').find({}).limit(5).toArray();
      console.log('\nSample users:');
      users.forEach(user => {
        console.log(`- ${user.fullName} (${user.email}) - ${user.role}`);
      });
    }
    
    console.log('\nConnection and query test successful!');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    return false;
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testDirectConnection()
  .then(success => {
    console.log(`\nTest ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 