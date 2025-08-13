const axios = require('axios');

// Simple test user with unique email using timestamp
const user = {
  fullName: 'Simple Test User',
  email: `simple_${Date.now()}@test.com`,
  password: 'password123',
  phone: '1234567890',
  address: '123 Simple Test St',
  role: 'customer'
};

console.log('Testing simple registration with user:', user.email);

// Try to register
axios.post('http://localhost:5000/api/users/register', user)
  .then(response => {
    console.log('Registration successful!');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check server info
    return axios.get('http://localhost:5000/api/server-info');
  })
  .then(response => {
    console.log('\nServer info:');
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('Registration failed:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }); 