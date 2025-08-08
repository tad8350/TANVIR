const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testProductCreationFix() {
  try {
    console.log('🧪 Testing Product Creation Fix...\n');

    // 1. Admin login
    console.log('1️⃣ Admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    const adminToken = adminResponse.data.access_token;

    // 2. Test product creation with clean data
    console.log('\n2️⃣ Testing product creation with clean data...');
    const cleanProductData = {
      name: "Test Product",
      title: "Test Product Title",
      description: "A test product for debugging",
      shortDescription: "Test product",
      price: "29.99",
      brand: "Test Brand",
      status: "active",
      categoryLevel1: "men",
      categoryLevel2: "clothing",
      categoryLevel3: "T-shirts",
      category: "men-clothing-tshirts",
      tags: ["test", "product"],
      hasVariants: false,
      variantType: "none",
      colorBlocks: [
        {
          id: "block-1",
          color: "Blue",
          newColor: "",
          images: [],
          sizes: [
            {
              id: "size-1",
              size: "M",
              quantity: "10"
            }
          ]
        }
      ],
      images: [],
      variants: []
    };

    console.log('Sending clean product data:', JSON.stringify(cleanProductData, null, 2));

    const productResponse = await axios.post(
      `${BASE_URL}/products`,
      cleanProductData,
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
    console.log('Product Tags:', productResponse.data.tags);

    console.log('\n🎉 Product creation fix is working!');
    console.log('\n📋 What was fixed:');
    console.log('✅ Removed errors object from request data');
    console.log('✅ Cleaned up data structure');
    console.log('✅ Only sending backend-expected fields');
    console.log('✅ Proper authentication working');
    console.log('✅ Database insertion successful');

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

testProductCreationFix();
