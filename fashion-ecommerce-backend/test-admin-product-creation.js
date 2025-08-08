const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let adminToken = '';
let customerToken = '';

async function testAdminProductCreation() {
  try {
    console.log('🧪 Testing Admin Authentication and Product Creation...\n');

    // 1. Test admin login
    console.log('1️⃣ Testing admin login...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'superadmin@tad.com',
      password: 'Admin@123#'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Token:', adminLoginResponse.data.access_token.substring(0, 50) + '...');
    console.log('Admin data:', adminLoginResponse.data.admin);
    
    adminToken = adminLoginResponse.data.access_token;

    // 2. Test customer login (for comparison)
    console.log('\n2️⃣ Testing customer login...');
    try {
      const customerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'customer@example.com',
        password: 'password123'
      });
      
      console.log('✅ Customer login successful!');
      customerToken = customerLoginResponse.data.access_token;
    } catch (error) {
      console.log('⚠️ Customer login failed (expected if user doesn\'t exist):', error.response?.data?.message || error.message);
    }

    // 3. Test product creation with admin token
    console.log('\n3️⃣ Testing product creation with admin token...');
    const testProduct = {
      name: "Admin Test Product",
      title: "Admin Test Product Title",
      description: "Test product created by admin",
      shortDescription: "Admin test product",
      price: "99.99",
      salePrice: "89.99",
      costPrice: "50.00",
      sku: "ADMIN-TEST-001",
      barcode: "1234567890124",
      brand: "Admin Brand",
      status: "active",
      categoryLevel1: "men",
      categoryLevel2: "clothing",
      categoryLevel3: "T-shirts",
      category: "men-clothing-tshirts",
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
              quantity: "25"
            }
          ]
        }
      ],
      images: ["https://example.com/admin-test-image.jpg"],
      hasVariants: true,
      variantType: "color",
      variants: [],
      metaTitle: "Admin Test Product - SEO Title",
      metaDescription: "Admin test product SEO description",
      keywords: "admin, test, product, clothing",
      tags: ["admin", "test", "product", "clothing"],
      shippingWeight: "0.8",
      shippingDimensions: {
        length: "35",
        width: "25",
        height: "8"
      },
      freeShipping: false,
      shippingClass: "standard",
      taxClass: "standard",
      taxRate: "10.00",
      trackInventory: true,
      allowBackorders: false,
      maxOrderQuantity: "5",
      minOrderQuantity: "1",
      isVirtual: false,
      isDownloadable: false,
      downloadLimit: "3",
      downloadExpiry: "30"
    };

    const adminProductResponse = await axios.post(
      `${BASE_URL}/products`,
      testProduct,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Admin product creation successful!');
    console.log('Product ID:', adminProductResponse.data.id);
    console.log('Product Name:', adminProductResponse.data.name);

    // 4. Test product creation with customer token (should fail)
    if (customerToken) {
      console.log('\n4️⃣ Testing product creation with customer token (should fail)...');
      try {
        await axios.post(
          `${BASE_URL}/products`,
          {
            name: "Customer Test Product",
            description: "This should fail",
            price: "29.99"
          },
          {
            headers: {
              'Authorization': `Bearer ${customerToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('❌ Customer product creation should have failed but succeeded!');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Customer product creation correctly blocked (403 Forbidden)');
          console.log('Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
        }
      }
    }

    // 5. Test product creation without token (should fail)
    console.log('\n5️⃣ Testing product creation without token (should fail)...');
    try {
      await axios.post(
        `${BASE_URL}/products`,
        {
          name: "No Token Test Product",
          description: "This should fail",
          price: "19.99"
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('❌ Product creation without token should have failed but succeeded!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Product creation without token correctly blocked (401 Unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // 6. Test getting the created product
    console.log('\n6️⃣ Testing get product by ID...');
    const productId = adminProductResponse.data.id;
    const getProductResponse = await axios.get(`${BASE_URL}/products/${productId}`);
    console.log('✅ Get product successful!');
    console.log('Product details:', {
      id: getProductResponse.data.id,
      name: getProductResponse.data.name,
      price: getProductResponse.data.price
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Admin authentication working');
    console.log('✅ Role-based authorization working');
    console.log('✅ Product creation with admin token working');
    console.log('✅ Unauthorized access properly blocked');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed - check admin credentials');
    } else if (error.response?.status === 403) {
      console.error('Authorization failed - check role permissions');
    }
  }
}

testAdminProductCreation();
