const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login...\n');

    // Test admin login
    console.log('1️⃣ Testing admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Response structure:', {
      hasAccessToken: !!adminResponse.data.access_token,
      hasAdminData: !!adminResponse.data.admin,
      adminRole: adminResponse.data.admin?.role,
      adminEmail: adminResponse.data.admin?.email
    });
    console.log('Full response:', JSON.stringify(adminResponse.data, null, 2));

    // Test with the token
    console.log('\n2️⃣ Testing API call with token...');
    const testResponse = await axios.get(`${BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${adminResponse.data.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API call with token successful!');
    console.log('Products endpoint working:', testResponse.data.length, 'products');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure your backend server is running:');
      console.error('   cd fashion-ecommerce-backend');
      console.error('   npm run start:dev');
    }
  }
}

testAdminLogin();
