const axios = require('axios');

// Test user data with unique email to avoid conflicts
const testUser = {
  fullName: 'Test Registration User',
  email: `testuser_${Date.now()}@example.com`, // Use timestamp to ensure unique email
  password: 'password123',
  phone: '5551234567',
  address: '123 Test Avenue, Registration City',
  role: 'customer'
};

console.log('Testing registration functionality with MongoDB Atlas (Tiffin database)');
console.log('Test user:', testUser);

// Register the user
axios.post('http://localhost:5000/api/users/register', testUser)
  .then(response => {
    console.log('\nRegistration successful!');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Now try to login with the same credentials
    return axios.post('http://localhost:5000/api/users/login', {
      email: testUser.email,
      password: testUser.password
    });
  })
  .then(response => {
    console.log('\nLogin successful!');
    console.log('User data:', JSON.stringify(response.data.user, null, 2));
    
    // Store the token for future requests
    const token = response.data.user.token;
    
    // Check server info to verify database connection
    return axios.get('http://localhost:5000/api/server-info');
  })
  .then(response => {
    console.log('\nServer information:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\nTest completed successfully!');
  })
  .catch(error => {
    console.error('\nError occurred:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }); 