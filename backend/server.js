const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Routes import
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load env vars
dotenv.config();

// Set environment variables manually if not found in .env
process.env.JWT_SECRET = process.env.JWT_SECRET || 'tiffinwallahsecret123';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log request body for POST and PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Capture and log the response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response Status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log('Response Body:', data);
    }
    originalSend.call(this, data);
  };
  
  next();
});

// Setup in-memory database for fallback
const setupInMemoryDB = () => {
  console.log('Setting up in-memory database');
  
  // Setup in-memory data storage for User model
  global.users = [];
  
  // Override User model methods for in-memory operation
  const User = require('./models/User');
  
  User.create = async function(userData) {
    console.log('In-memory DB: Creating user', userData.email);
    const user = { 
      _id: Math.random().toString(36).substr(2, 9), 
      ...userData,
      createdAt: new Date()
    };
    global.users.push(user);
    console.log('In-memory DB: User created successfully', user._id);
    console.log('In-memory DB: Total users:', global.users.length);
    return user;
  };
  
  User.findOne = async function({ email }) {
    console.log('In-memory DB: Finding user by email', email);
    const user = global.users.find(user => user.email === email);
    console.log('In-memory DB: User found?', !!user);
    return user;
  };
  
  User.findById = async function(id) {
    console.log('In-memory DB: Finding user by ID', id);
    const user = global.users.find(user => user._id === id);
    console.log('In-memory DB: User found?', !!user);
    return user;
  };

  User.find = async function() {
    console.log('In-memory DB: Finding all users');
    console.log('In-memory DB: Total users:', global.users.length);
    return global.users;
  };

  User.countDocuments = async function() {
    return global.users.length;
  };
  
  console.log('In-memory database setup complete');
};

// Connect to MongoDB Atlas
console.log('Attempting to connect to MongoDB Atlas...');
connectDB()
  .then(connected => {
    if (connected) {
      console.log('MongoDB Atlas connection successful');
    } else {
      console.log('MongoDB Atlas connection failed, using in-memory database instead');
      setupInMemoryDB();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    setupInMemoryDB();
  });

// Sample data for testing
const sampleFoods = [
  { id: 1, name: 'Chicken Biryani', price: 12.99, description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices.' },
  { id: 2, name: 'Paneer Butter Masala', price: 10.99, description: 'Soft paneer cubes in a creamy tomato-based curry.' },
  { id: 3, name: 'Masala Dosa', price: 8.99, description: 'A thin crispy crepe filled with spiced potatoes.' }
];

// Routes
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Comment out or remove this duplicate route - it's conflicting with the foodRoutes
/* Test route - COMMENTED OUT to avoid conflicts with foodRoutes
app.get('/api/foods', (req, res) => {
  res.json({
    success: true,
    count: sampleFoods.length,
    data: sampleFoods
  });
});
*/

// Test MongoDB connection
app.get('/api/test-db', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.json({ 
      success: true, 
      message: 'MongoDB connected successfully!', 
      database: mongoose.connection.db.databaseName,
      readyState: mongoose.connection.readyState
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'MongoDB not connected!', 
      readyState: mongoose.connection.readyState 
    });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

// Test route
app.get('/api/server-info', (req, res) => {
  const dbInfo = mongoose.connection.readyState === 1 ? {
    connected: true,
    database: mongoose.connection.db.databaseName,
    host: mongoose.connection.host,
    collections: null
  } : {
    connected: false,
    readyState: mongoose.connection.readyState
  };

  // If connected, try to get collection info
  if (dbInfo.connected) {
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        dbInfo.collections = collections.map(c => c.name);
        res.json({
          server: {
            env: process.env.NODE_ENV,
            port: PORT
          },
          database: dbInfo,
          inMemoryMode: !!global.users,
          inMemoryUsers: global.users ? global.users.length : null
        });
      })
      .catch(err => {
        dbInfo.error = err.message;
        res.json({
          server: {
            env: process.env.NODE_ENV,
            port: PORT
          },
          database: dbInfo,
          inMemoryMode: !!global.users,
          inMemoryUsers: global.users ? global.users.length : null
        });
      });
  } else {
    res.json({
      server: {
        env: process.env.NODE_ENV,
        port: PORT
      },
      database: dbInfo,
      inMemoryMode: !!global.users,
      inMemoryUsers: global.users ? global.users.length : null
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 