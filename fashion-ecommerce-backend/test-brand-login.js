const axios = require('axios');

async function testBrandLogin() {
  try {
    console.log('🧪 Testing Brand Login Directly...\n');

    const loginData = {
      email: 'm@gmail.com',
      password: 'C@dYigljZoY$'
    };

    console.log('📤 Sending login request with:', loginData);
    console.log('🔗 Endpoint: http://localhost:3001/auth/brand/login');

    const response = await axios.post('http://localhost:3001/auth/brand/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('📊 Response status:', response.status);
    console.log('🔑 Access token:', response.data.access_token ? 'Received' : 'Missing');
    console.log('🏢 Brand data:', response.data.brand);

  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testBrandLogin();
