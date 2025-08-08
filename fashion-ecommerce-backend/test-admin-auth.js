const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

async function testAdminAuth() {
  try {
    // 1. Test admin login
    console.log('\n1. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    
    authToken = loginResponse.data.access_token;
    
    // 2. Test protected route (create product)
    console.log('\n2. Testing protected route (create product)...');
    const productResponse = await axios.post(
      `${BASE_URL}/products`,
      {
        name: 'Test Product',
        description: 'Test product description',
        price: 99.99,
        category_id: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Product creation successful!');
    console.log('Response:', JSON.stringify(productResponse.data, null, 2));

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAdminAuth();
