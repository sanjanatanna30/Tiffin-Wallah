const axios = require('axios');

// Test user data
const testUser = {
  fullName: 'Test User API',
  email: 'testapi@example.com',
  password: 'password123',
  phone: '9876543210',
  address: '456 API Test Street, Test City',
  role: 'customer'
};

// Function to test user registration
const testRegister = async () => {
  console.log('Testing user registration API...');
  console.log('User data:', testUser);
  
  try {
    console.log('Sending register request to API...');
    const response = await axios.post('http://localhost:5000/api/users/register', testUser);
    
    console.log('=== REGISTRATION SUCCESSFUL ===');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    return true;
  } catch (error) {
    console.error('=== REGISTRATION FAILED ===');
    
    if (error.response) {
      // Server responded with an error
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
      console.error('Request:', error.request);
    } else {
      // Error during request setup
      console.error('Error setting up request:', error.message);
    }
    
    return false;
  }
};

// Test database connection
const testDBConnection = async () => {
  console.log('Testing database connection...');
  
  try {
    const response = await axios.get('http://localhost:5000/api/users/test-db');
    console.log('Database connection status:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Failed to check database connection');
    if (error.response) {
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
};

// Run the tests
const runTests = async () => {
  try {
    // Test server connection
    try {
      const serverResponse = await axios.get('http://localhost:5000/api/test');
      console.log('Server is running:', serverResponse.data);
    } catch (error) {
      console.error('Server is not running!');
      process.exit(1);
    }
    
    // Test database connection
    const dbConnected = await testDBConnection();
    console.log('Database connected:', dbConnected);
    
    // Test user registration
    const registerSuccess = await testRegister();
    console.log(`User registration ${registerSuccess ? 'SUCCEEDED' : 'FAILED'}`);
    
    process.exit(registerSuccess ? 0 : 1);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
};

runTests(); 