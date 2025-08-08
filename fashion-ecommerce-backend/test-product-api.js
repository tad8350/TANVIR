const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testProductAPI() {
  try {
    console.log('Testing Product API...\n');

    // Test 1: Get brands list
    console.log('1. Testing GET /products/brands/list');
    try {
      const brandsResponse = await axios.get(`${API_BASE_URL}/products/brands/list`);
      console.log('✅ Brands endpoint working:', brandsResponse.data);
    } catch (error) {
      console.log('❌ Brands endpoint failed:', error.response?.data || error.message);
    }

    // Test 2: Get colors list
    console.log('\n2. Testing GET /products/colors/list');
    try {
      const colorsResponse = await axios.get(`${API_BASE_URL}/products/colors/list`);
      console.log('✅ Colors endpoint working:', colorsResponse.data);
    } catch (error) {
      console.log('❌ Colors endpoint failed:', error.response?.data || error.message);
    }

    // Test 3: Get sizes list
    console.log('\n3. Testing GET /products/sizes/list');
    try {
      const sizesResponse = await axios.get(`${API_BASE_URL}/products/sizes/list`);
      console.log('✅ Sizes endpoint working:', sizesResponse.data);
    } catch (error) {
      console.log('❌ Sizes endpoint failed:', error.response?.data || error.message);
    }

    // Test 4: Create a product
    console.log('\n4. Testing POST /products');
    const testProduct = {
      name: "Test Product",
      title: "Test Product Title",
      description: "Test product description",
      shortDescription: "Test short description",
      price: "29.99",
      salePrice: "24.99",
      costPrice: "15.00",
      sku: "TEST-PRODUCT-001",
      barcode: "1234567890123",
      brand: "Test Brand",
      status: "active",
      categoryLevel1: "men",
      categoryLevel2: "clothing",
      categoryLevel3: "T-shirts",
      category: "men-clothing-tshirts",
      colorBlocks: [
        {
          id: "block-1",
          color: "Black",
          newColor: "",
          images: [],
          sizes: [
            {
              id: "size-1",
              size: "M",
              quantity: "50"
            },
            {
              id: "size-2",
              size: "L",
              quantity: "30"
            }
          ]
        }
      ],
      images: ["https://example.com/test-image.jpg"],
      hasVariants: true,
      variantType: "color",
      variants: [],
      metaTitle: "Test Product - SEO Title",
      metaDescription: "Test product SEO description",
      keywords: "test, product, clothing",
      tags: ["test", "product", "clothing"],
      shippingWeight: "0.5",
      shippingDimensions: {
        length: "30",
        width: "20",
        height: "5"
      },
      freeShipping: false,
      shippingClass: "standard",
      taxClass: "standard",
      taxRate: "10.00",
      trackInventory: true,
      allowBackorders: false,
      maxOrderQuantity: "10",
      minOrderQuantity: "1",
      isVirtual: false,
      isDownloadable: false,
      downloadLimit: "5",
      downloadExpiry: "30"
    };

    try {
      const createResponse = await axios.post(`${API_BASE_URL}/products`, testProduct);
      console.log('✅ Product creation working:', createResponse.data);
      
      // Test 5: Get the created product
      console.log('\n5. Testing GET /products/:id');
      const productId = createResponse.data.id;
      const getProductResponse = await axios.get(`${API_BASE_URL}/products/${productId}`);
      console.log('✅ Get product working:', getProductResponse.data);
      
    } catch (error) {
      console.log('❌ Product creation failed:', error.response?.data || error.message);
    }

    // Test 6: Get all products
    console.log('\n6. Testing GET /products');
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products`);
      console.log('✅ Get products working:', productsResponse.data);
    } catch (error) {
      console.log('❌ Get products failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProductAPI();
