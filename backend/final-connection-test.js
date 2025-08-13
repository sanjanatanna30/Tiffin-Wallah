const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://rockygaming9090:9YoPEu0wvC95Oob6@practicak.arihpta.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with modern options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});

async function run() {
  try {
    // Connect the client to the server
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    
    // Verify connection by pinging the database
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas");
    
    // List all available databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("Available databases:");
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Create/use the Tiffin database
    const db = client.db("Tiffin");
    console.log(`\nUsing database: ${db.databaseName}`);
    
    // Create a test collection if it doesn't exist
    await db.createCollection("test_collection");
    console.log("Created or accessed test_collection");
    
    // List all collections in the Tiffin database
    const collections = await db.listCollections().toArray();
    console.log("\nCollections in Tiffin database:");
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Insert a test document
    const testDocument = {
      name: "Test Document",
      timestamp: new Date(),
      message: "This is a test document for the registration system"
    };
    
    const result = await db.collection("test_collection").insertOne(testDocument);
    console.log(`\nInserted test document with _id: ${result.insertedId}`);
    
    // Find the document we just inserted
    const foundDocument = await db.collection("test_collection").findOne({ _id: result.insertedId });
    console.log("Found the document:", foundDocument);
    
    // Add a test user to simulate registration
    const testUser = {
      fullName: "Final Test User",
      email: `finaltest_${Date.now()}@example.com`,
      password: "hashed_password_would_go_here",
      phone: "5551234567",
      address: "123 Final Test Street",
      role: "customer",
      createdAt: new Date()
    };
    
    // Check if users collection exists, if not create it
    if (!collections.some(c => c.name === "users")) {
      await db.createCollection("users");
      console.log("Created users collection");
    }
    
    // Insert the test user
    const userResult = await db.collection("users").insertOne(testUser);
    console.log(`\nInserted test user with _id: ${userResult.insertedId}`);
    
    // List all users in the database
    const users = await db.collection("users").find({}).toArray();
    console.log("\nUsers in database:");
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - ${user.role}`);
    });
    
    console.log("\nMongoDB Atlas connection and operations successful!");
  } catch (e) {
    console.error("MongoDB connection error:", e);
    
    // Try to determine if it's a networking issue
    const { exec } = require('child_process');
    exec('ping -n 4 practicak.arihpta.mongodb.net', (error, stdout, stderr) => {
      console.log('\nPing test to MongoDB Atlas:');
      if (error) {
        console.log('Error pinging MongoDB server:', error.message);
      } else {
        console.log(stdout);
      }
      
      console.log("\nPossible issues:");
      console.log("1. IP Whitelist: Make sure 0.0.0.0/0 is in your IP Access List");
      console.log("2. Credentials: Double-check username/password");
      console.log("3. Network: Check if any firewalls are blocking the connection");
      console.log("4. VPN: If you're using a VPN, try disabling it");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Connection closed");
  }
}

run().catch(console.dir); 