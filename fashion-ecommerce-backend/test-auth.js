const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  try {
    console.log('Testing authentication flow...\n');

    // 1. Test health endpoint (should work without auth)
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health endpoint works:', healthResponse.data);

    // 2. Login with existing user
    console.log('\n2. Logging in with existing user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data);

    const token = loginResponse.data.access_token;
    console.log('Token received:', token.substring(0, 20) + '...');

    // 3. Test protected endpoint with token
    console.log('\n3. Testing protected endpoint with token...');
    const protectedResponse = await axios.get(`${BASE_URL}/auth/test`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected endpoint works:', protectedResponse.data);

    // 4. Test protected endpoint without token (should fail)
    console.log('\n4. Testing protected endpoint without token...');
    try {
      await axios.get(`${BASE_URL}/auth/test`);
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly failed with 401:', error.response.status);
    }

    // 5. Test users endpoint with token
    console.log('\n5. Testing users endpoint with token...');
    const usersResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Users endpoint works:', usersResponse.data);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth(); 