const MongoClient = require('mongodb').MongoClient;

// Connection URL with credentials and database name
const url = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/Tiffin';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  ssl: true,
  w: 'majority'
};

console.log('Attempting to connect to MongoDB Atlas...');

// Connect to MongoDB
MongoClient.connect(url, options)
  .then(client => {
    console.log('Successfully connected to MongoDB Atlas!');
    
    // Get the database
    const db = client.db('Tiffin');
    console.log('Database:', db.databaseName);
    
    // Test by creating a collection if it doesn't exist
    return db.createCollection('test_connection')
      .then(() => {
        console.log('Created test_connection collection (or it already exists)');
        
        // List all collections
        return db.listCollections().toArray();
      })
      .then(collections => {
        console.log('\nAvailable collections:');
        collections.forEach(coll => {
          console.log(`- ${coll.name}`);
        });
        
        // Insert a test document
        const testDoc = {
          name: 'Test Connection',
          created: new Date(),
          successful: true
        };
        
        return db.collection('test_connection').insertOne(testDoc);
      })
      .then(result => {
        console.log('\nInserted test document with ID:', result.insertedId);
        
        // Close the connection
        client.close();
        console.log('Connection closed');
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    
    // Try with a simpler connection string
    console.log('\nTrying with a simpler connection string...');
    
    const simpleUrl = 'mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority';
    
    return MongoClient.connect(simpleUrl, options)
      .then(client => {
        console.log('Successfully connected with simpler connection string!');
        console.log('Available databases:');
        
        // List all databases
        return client.db().admin().listDatabases()
          .then(result => {
            result.databases.forEach(db => {
              console.log(`- ${db.name}`);
            });
            
            // Try to access Tiffin database
            const db = client.db('Tiffin');
            console.log('\nAccessing Tiffin database...');
            
            // Close the connection
            client.close();
            console.log('Connection closed');
          });
      })
      .catch(err => {
        console.error('Still unable to connect with simpler string:', err.message);
        
        // Check if it's a network issue
        console.log('\nAttempting to ping MongoDB Atlas to check network connectivity...');
        
        const { exec } = require('child_process');
        exec('ping -n 4 practicak.arihpta.mongodb.net', (error, stdout, stderr) => {
          if (error) {
            console.error('Ping failed:', error.message);
            return;
          }
          if (stderr) {
            console.error('Ping stderr:', stderr);
            return;
          }
          console.log('Ping result:');
          console.log(stdout);
        });
      });
  }); 