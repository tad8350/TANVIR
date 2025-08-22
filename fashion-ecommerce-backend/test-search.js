const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data for search
const testQueries = [
  'nike',
  'shoes',
  'adidas',
  'sports',
  'casual',
  'formal',
  'summer',
  'winter'
];

async function testSearchEndpoints() {
  console.log('🧪 Testing Search Functionality for TAD Fashion E-commerce\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Search Service Health Check...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/search/health`);
      console.log('✅ Health Check:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health Check Failed:', error.message);
    }

    // Test 2: Search Suggestions
    console.log('\n2️⃣ Testing Search Suggestions...');
    for (const query of testQueries.slice(0, 3)) {
      try {
        const suggestionsResponse = await axios.get(`${BASE_URL}/search/suggestions?query=${query}&limit=5`);
        console.log(`✅ Suggestions for "${query}":`, suggestionsResponse.data);
      } catch (error) {
        console.log(`❌ Suggestions for "${query}" failed:`, error.message);
      }
    }

    // Test 3: Full-Text Search
    console.log('\n3️⃣ Testing Full-Text Search...');
    try {
      const searchResponse = await axios.post(`${BASE_URL}/search/products`, {
        query: 'nike shoes',
        type: 'full_text',
        page: 1,
        limit: 10,
        status: 'active'
      });
      console.log('✅ Full-Text Search Results:', {
        total: searchResponse.data.meta.total,
        results: searchResponse.data.data.length,
        executionTime: searchResponse.data.meta.executionTime + 'ms'
      });
    } catch (error) {
      console.log('❌ Full-Text Search Failed:', error.message);
    }

    // Test 4: Fuzzy Search
    console.log('\n4️⃣ Testing Fuzzy Search...');
    try {
      const fuzzyResponse = await axios.post(`${BASE_URL}/search/products`, {
        query: 'nik',
        type: 'fuzzy',
        page: 1,
        limit: 10,
        status: 'active'
      });
      console.log('✅ Fuzzy Search Results:', {
        total: fuzzyResponse.data.meta.total,
        results: fuzzyResponse.data.data.length,
        executionTime: fuzzyResponse.data.meta.executionTime + 'ms'
      });
    } catch (error) {
      console.log('❌ Fuzzy Search Failed:', error.message);
    }

    // Test 5: Exact Search
    console.log('\n5️⃣ Testing Exact Search...');
    try {
      const exactResponse = await axios.post(`${BASE_URL}/search/products`, {
        query: 'nike',
        type: 'exact',
        page: 1,
        limit: 10,
        status: 'active'
      });
      console.log('✅ Exact Search Results:', {
        total: exactResponse.data.meta.total,
        results: exactResponse.data.data.length,
        executionTime: exactResponse.data.meta.executionTime + 'ms'
      });
    } catch (error) {
      console.log('❌ Exact Search Failed:', error.message);
    }

    // Test 6: Search with Filters
    console.log('\n6️⃣ Testing Search with Filters...');
    try {
      const filteredResponse = await axios.post(`${BASE_URL}/search/products`, {
        query: 'shoes',
        type: 'full_text',
        page: 1,
        limit: 10,
        status: 'active',
        minPrice: 10,
        maxPrice: 200
      });
      console.log('✅ Filtered Search Results:', {
        total: filteredResponse.data.meta.total,
        results: filteredResponse.data.data.length,
        executionTime: filteredResponse.data.meta.executionTime + 'ms',
        filters: filteredResponse.data.filters
      });
    } catch (error) {
      console.log('❌ Filtered Search Failed:', error.message);
    }

    // Test 7: GET Search Endpoint
    console.log('\n7️⃣ Testing GET Search Endpoint...');
    try {
      const getSearchResponse = await axios.get(`${BASE_URL}/search/products?query=nike&type=full_text&page=1&limit=5`);
      console.log('✅ GET Search Results:', {
        total: getSearchResponse.data.meta.total,
        results: getSearchResponse.data.data.length,
        executionTime: getSearchResponse.data.meta.executionTime + 'ms'
      });
    } catch (error) {
      console.log('❌ GET Search Failed:', error.message);
    }

    // Test 8: Detailed Search Suggestions
    console.log('\n8️⃣ Testing Detailed Search Suggestions...');
    try {
      const detailedSuggestionsResponse = await axios.post(`${BASE_URL}/search/suggestions`, {
        query: 'nik',
        limit: 10
      });
      console.log('✅ Detailed Suggestions:', detailedSuggestionsResponse.data);
    } catch (error) {
      console.log('❌ Detailed Suggestions Failed:', error.message);
    }

    console.log('\n🎉 Search Functionality Testing Completed!');
    console.log('\n📊 Performance Summary:');
    console.log('- Full-Text Search: PostgreSQL FTS with GIN indexes');
    console.log('- Fuzzy Search: Trigram similarity for typo tolerance');
    console.log('- Exact Search: ILIKE with relevance scoring');
    console.log('- Denormalized Search Table: Optimized for performance');
    console.log('- Automatic Synchronization: Real-time updates');

  } catch (error) {
    console.error('❌ Test Suite Failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Test search with different query types
async function testSearchPerformance() {
  console.log('\n🚀 Testing Search Performance...\n');

  const performanceQueries = [
    { query: 'nike', type: 'full_text' },
    { query: 'adidas', type: 'fuzzy' },
    { query: 'shoes', type: 'exact' },
    { query: 'sports', type: 'full_text' },
    { query: 'casual', type: 'fuzzy' }
  ];

  for (const searchQuery of performanceQueries) {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/search/products`, {
        ...searchQuery,
        page: 1,
        limit: 20,
        status: 'active'
      });
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`🔍 ${searchQuery.type.toUpperCase()} Search: "${searchQuery.query}"`);
      console.log(`   Results: ${response.data.data.length}/${response.data.meta.total}`);
      console.log(`   Execution Time: ${executionTime}ms`);
      console.log(`   Service Time: ${response.data.meta.executionTime}ms`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${searchQuery.type.toUpperCase()} Search Failed:`, error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Search Functionality Tests...\n');
  
  await testSearchEndpoints();
  await testSearchPerformance();
  
  console.log('\n✨ All tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Check the database for the product_search table');
  console.log('2. Verify indexes are created (GIN, trigram)');
  console.log('3. Test with real product data');
  console.log('4. Monitor performance metrics');
}

// Check if server is running
async function checkServerStatus() {
  try {
    await axios.get(`${BASE_URL}/search/health`);
    console.log('✅ Server is running, starting tests...\n');
    await runTests();
  } catch (error) {
    console.error('❌ Server is not running. Please start the backend server first:');
    console.error('   npm run start:dev');
    console.error('\n   Then run this test script again.');
  }
}

// Start testing
checkServerStatus();
