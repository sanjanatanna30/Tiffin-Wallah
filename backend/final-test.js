const axios = require('axios');

// Async function to test registration
async function testRegistration() {
  try {
    // Create unique user
    const user = {
      fullName: 'Final Test User',
      email: `finaltest_${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      address: '123 Final Test St',
      role: 'customer'
    };
    
    console.log('Testing registration with user:', user.email);
    
    // Register user
    const registerResponse = await axios.post('http://localhost:5000/api/users/register', user);
    console.log('\nRegistration successful!');
    console.log(JSON.stringify(registerResponse.data, null, 2));
    
    // Get server info
    const serverInfo = await axios.get('http://localhost:5000/api/server-info');
    console.log('\nServer info:');
    console.log(JSON.stringify(serverInfo.data, null, 2));
    
    return {
      success: true,
      userId: registerResponse.data.user._id
    };
  } catch (error) {
    console.error('\nError:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
    return { success: false };
  }
}

// Run test
(async () => {
  console.log('Starting registration test...');
  
  const result = await testRegistration();
  
  if (result.success) {
    console.log(`\nTest completed successfully! User ID: ${result.userId}`);
  } else {
    console.log('\nTest failed.');
  }
  
  console.log('\nTest script finished.');
})(); 