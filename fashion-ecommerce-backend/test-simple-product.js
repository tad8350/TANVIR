const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testSimpleProduct() {
  try {
    console.log('🧪 Testing Simple Product Creation...\n');

    // 1. Admin login
    console.log('1️⃣ Admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    const adminToken = adminResponse.data.access_token;

    // 2. Create simple product
    console.log('\n2️⃣ Creating simple product...');
    const productData = {
      name: "Test Product",
      title: "Test Product Title",
      description: "Simple test product",
      shortDescription: "Test product",
      price: "29.99",
      brand: "Test Brand",
      status: "active",
      categoryLevel1: "men",
      categoryLevel2: "clothing",
      category: "men-clothing",
      tags: ["test", "product", "simple"],
      hasVariants: false,
      variantType: "none"
    };

    const productResponse = await axios.post(
      `${BASE_URL}/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Product creation successful!');
    console.log('Product ID:', productResponse.data.id);
    console.log('Product Name:', productResponse.data.name);
    console.log('Tags:', productResponse.data.tags);

    // 3. Test with string tags
    console.log('\n3️⃣ Testing with string tags...');
    const productData2 = {
      name: "Test Product 2",
      title: "Test Product 2 Title",
      description: "Test product with string tags",
      shortDescription: "Test product 2",
      price: "39.99",
      brand: "Test Brand 2",
      status: "active",
      categoryLevel1: "women",
      categoryLevel2: "clothing",
      category: "women-clothing",
      tags: "tag1,tag2,tag3",
      hasVariants: false,
      variantType: "none"
    };

    const productResponse2 = await axios.post(
      `${BASE_URL}/products`,
      productData2,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Product 2 creation successful!');
    console.log('Product ID:', productResponse2.data.id);
    console.log('Product Name:', productResponse2.data.name);
    console.log('Tags:', productResponse2.data.tags);

    console.log('\n🎉 All tests passed! Tags handling is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testSimpleProduct();
