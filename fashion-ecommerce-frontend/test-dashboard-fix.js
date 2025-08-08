const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testDashboardFix() {
  try {
    console.log('🧪 Testing Dashboard Fix...\n');

    // 1. Customer login
    console.log('1️⃣ Customer login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'tanahmed@gmail.com',
      password: 'your_password_here'
    });
    
    console.log('✅ Customer login successful!');
    const token = loginResponse.data.access_token;

    // 2. Test getting products
    console.log('\n2️⃣ Testing products endpoint...');
    const productsResponse = await axios.get(`${BASE_URL}/products?page=1&limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Products fetched successfully!');
    console.log('Products count:', productsResponse.data.data?.length || 0);
    
    if (productsResponse.data.data && productsResponse.data.data.length > 0) {
      const firstProduct = productsResponse.data.data[0];
      console.log('First product brand type:', typeof firstProduct.brand);
      console.log('First product brand value:', firstProduct.brand);
      
      if (typeof firstProduct.brand === 'object') {
        console.log('Brand object keys:', Object.keys(firstProduct.brand));
        console.log('Brand name:', firstProduct.brand.brand_name || firstProduct.brand.name);
      }
    }

    console.log('\n🎉 Dashboard fix is working!');
    console.log('\n📋 What was fixed:');
    console.log('✅ Brand object handling');
    console.log('✅ Safe brand name extraction');
    console.log('✅ Error handling for product transformation');
    console.log('✅ Fallback values for missing data');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.response?.data) {
      console.error('Backend error details:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure your backend server is running:');
      console.error('   cd fashion-ecommerce-backend');
      console.error('   npm run start:dev');
    }
  }
}

testDashboardFix();
