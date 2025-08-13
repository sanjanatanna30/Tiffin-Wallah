const axios = require('axios');

// Test user data
const testUser = {
  fullName: 'TiffinWallah Customer',
  email: 'customer-new@tiffinwallah.com',
  password: 'password123',
  phone: '5551234567',
  address: '555 Food Street, Spice City',
  role: 'customer'
};

// Function to test server info 
const getServerInfo = async () => {
  try {
    console.log('Getting server info...');
    const response = await axios.get('http://localhost:5000/api/server-info');
    console.log('Server info:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error getting server info:', error.message);
    return null;
  }
};

// Function to test user registration
const registerUser = async () => {
  try {
    console.log('\nRegistering new user:', testUser.email);
    const response = await axios.post('http://localhost:5000/api/users/register', testUser);
    console.log('Registration successful:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
};

// Function to test login
const loginUser = async () => {
  try {
    console.log('\nLogging in as:', testUser.email);
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.user.token;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

// Function to test getting user profile
const getUserProfile = async (token) => {
  if (!token) {
    console.error('No token provided for user profile test');
    return false;
  }
  
  try {
    console.log('\nGetting user profile...');
    const response = await axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('User profile:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Error getting user profile:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
};

// Run all tests
const runTests = async () => {
  try {
    // Get server info
    const serverInfo = await getServerInfo();
    if (!serverInfo) {
      console.error('Server is not running!');
      process.exit(1);
    }
    
    // Register user
    const registered = await registerUser();
    
    // Login user (even if registration failed, try to login in case user already exists)
    const token = await loginUser();
    
    // Get user profile if login successful
    if (token) {
      await getUserProfile(token);
    }
    
    console.log('\nTests completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Run the tests
runTests(); 