const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testProducts() {
  try {
    console.log('Testing products endpoint...\n');

    // Test products endpoint (should work without auth now)
    console.log('1. Testing products endpoint...');
    const productsResponse = await axios.get(`${BASE_URL}/products?page=1&limit=10&search=nike&category_id=1&brand_id=1&status=active`);
    console.log('✅ Products endpoint works:', productsResponse.status);
    console.log('Response data:', productsResponse.data);

    // Test categories endpoint (should work without auth)
    console.log('\n2. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
    console.log('✅ Categories endpoint works:', categoriesResponse.status);

    // Test brands endpoint (should work without auth)
    console.log('\n3. Testing brands endpoint...');
    const brandsResponse = await axios.get(`${BASE_URL}/brands`);
    console.log('✅ Brands endpoint works:', brandsResponse.status);

    console.log('\n🎉 All public endpoints are working!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testProducts(); 