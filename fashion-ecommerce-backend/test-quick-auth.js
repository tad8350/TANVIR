const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function quickTest() {
  try {
    console.log('🔍 Quick Authentication Test...\n');

    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Admin login
    console.log('\n2️⃣ Testing admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Token length:', adminResponse.data.access_token.length);
    console.log('Admin role:', adminResponse.data.admin.role);
    
    const adminToken = adminResponse.data.access_token;

    // Test 3: Test authentication endpoint
    console.log('\n3️⃣ Testing authentication endpoint...');
    const authTestResponse = await axios.get(`${BASE_URL}/auth/test`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log('✅ Authentication test passed:', authTestResponse.data);

    // Test 4: Test product creation
    console.log('\n4️⃣ Testing product creation...');
    const productResponse = await axios.post(
      `${BASE_URL}/products`,
      {
        name: "Quick Test Product",
        description: "Quick test product",
        price: "29.99",
        brand: "Test Brand",
        status: "active",
        categoryLevel1: "men",
        categoryLevel2: "clothing",
        category: "men-clothing"
      },
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Product creation successful!');
    console.log('Product ID:', productResponse.data.id);

    console.log('\n🎉 All tests passed! Authentication and authorization are working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

quickTest();
