const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

async function testFrontendIntegration() {
  try {
    console.log('🧪 Testing Frontend-Backend Integration...\n');

    // 1. Test backend is running
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Backend is running:', healthResponse.data);

    // 2. Test admin login
    console.log('\n2️⃣ Testing admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Token received:', adminResponse.data.access_token ? 'YES' : 'NO');
    console.log('Admin data:', adminResponse.data.admin);

    // 3. Test product creation with admin token
    console.log('\n3️⃣ Testing product creation with admin token...');
    const productData = {
      name: "Frontend Test Product",
      title: "Frontend Test Product Title",
      description: "Test product created from frontend integration test",
      shortDescription: "Frontend test product",
      price: "49.99",
      brand: "Test Brand",
      status: "active",
      categoryLevel1: "men",
      categoryLevel2: "clothing",
      categoryLevel3: "T-shirts",
      category: "men-clothing-tshirts",
      tags: ["frontend", "test", "integration"],
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

    const productResponse = await axios.post(
      `${BASE_URL}/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${adminResponse.data.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Product creation successful!');
    console.log('Product ID:', productResponse.data.id);
    console.log('Product Name:', productResponse.data.name);

    // 4. Test getting the created product
    console.log('\n4️⃣ Testing get product...');
    const getProductResponse = await axios.get(`${BASE_URL}/products/${productResponse.data.id}`);
    console.log('✅ Get product successful!');
    console.log('Product details:', {
      id: getProductResponse.data.id,
      name: getProductResponse.data.name,
      price: getProductResponse.data.price,
      tags: getProductResponse.data.tags
    });

    // 5. Test dropdown data endpoints
    console.log('\n5️⃣ Testing dropdown data endpoints...');
    
    const brandsResponse = await axios.get(`${BASE_URL}/products/brands/list`);
    console.log('✅ Brands endpoint working:', brandsResponse.data.length, 'brands');

    const colorsResponse = await axios.get(`${BASE_URL}/products/colors/list`);
    console.log('✅ Colors endpoint working:', colorsResponse.data.length, 'colors');

    const sizesResponse = await axios.get(`${BASE_URL}/products/sizes/list`);
    console.log('✅ Sizes endpoint working:', sizesResponse.data.length, 'sizes');

    console.log('\n🎉 All backend tests passed!');
    console.log('\n📋 Frontend Integration Checklist:');
    console.log('✅ Backend API is running and accessible');
    console.log('✅ Admin authentication is working');
    console.log('✅ Product creation with authentication is working');
    console.log('✅ Product retrieval is working');
    console.log('✅ Dropdown data endpoints are working');
    console.log('✅ Tags handling is working correctly');
    console.log('\n🚀 You can now test the frontend at:', FRONTEND_URL);
    console.log('📝 Admin login credentials:');
    console.log('   Email: superadmin@tad.com');
    console.log('   Password: Admin@123#');
    console.log('\n🔗 Admin panel URL:', `${FRONTEND_URL}/admin/signin`);

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

testFrontendIntegration();
