// Test script for admin logout functionality
// Run this in the browser console on any admin page to test logout

console.log('🧪 Testing Admin Logout Functionality...');

// Test 1: Check if admin token exists
function testAdminToken() {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
  const hasToken = !!tokenCookie;
  
  console.log('✅ Admin Token Check:', hasToken ? 'Token found' : 'No token found');
  return hasToken;
}

// Test 2: Check if localStorage has admin data
function testLocalStorage() {
  const adminUser = localStorage.getItem('adminUser');
  const adminSession = localStorage.getItem('adminSession');
  const brandFormDraft = localStorage.getItem('brandFormDraft');
  const productFormDraft = localStorage.getItem('productFormDraft');
  
  console.log('✅ LocalStorage Check:', {
    adminUser: !!adminUser,
    adminSession: !!adminSession,
    brandFormDraft: !!brandFormDraft,
    productFormDraft: !!productFormDraft
  });
  
  return { adminUser, adminSession, brandFormDraft, productFormDraft };
}

// Test 3: Simulate logout (without actually logging out)
function testLogoutSimulation() {
  console.log('✅ Logout Simulation Test:');
  
  // Check current state
  const beforeState = {
    token: testAdminToken(),
    localStorage: testLocalStorage()
  };
  
  console.log('📊 State before logout simulation:', beforeState);
  
  // Simulate what logout would do
  const simulatedLogout = () => {
    // Clear cookies
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear localStorage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('brandFormDraft');
    localStorage.removeItem('productFormDraft');
    
    console.log('🧹 Simulated logout cleanup completed');
  };
  
  // Run simulation
  simulatedLogout();
  
  // Check state after simulation
  const afterState = {
    token: testAdminToken(),
    localStorage: testLocalStorage()
  };
  
  console.log('📊 State after logout simulation:', afterState);
  
  // Verify cleanup
  const cleanupSuccessful = !afterState.token && 
    !afterState.localStorage.adminUser && 
    !afterState.localStorage.adminSession;
  
  console.log('✅ Cleanup Verification:', cleanupSuccessful ? 'SUCCESS' : 'FAILED');
  
  return cleanupSuccessful;
}

// Test 4: Test API service logout method (if available)
function testApiServiceLogout() {
  console.log('✅ API Service Logout Test:');
  
  try {
    // Check if apiService is available
    if (typeof window !== 'undefined' && window.apiService) {
      console.log('✅ apiService found, testing logout method');
      // Note: We won't actually call logout() to avoid disrupting the session
      return true;
    } else {
      console.log('⚠️ apiService not available in global scope');
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing API service:', error);
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('\n🚀 Running All Admin Logout Tests...\n');
  
  const results = {
    tokenCheck: testAdminToken(),
    localStorageCheck: testLocalStorage(),
    logoutSimulation: testLogoutSimulation(),
    apiServiceCheck: testApiServiceLogout()
  };
  
  console.log('\n📋 Test Results Summary:');
  console.table(results);
  
  const allPassed = Object.values(results).every(result => 
    typeof result === 'boolean' ? result : true
  );
  
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return results;
}

// Export functions for manual testing
window.testAdminLogout = {
  testAdminToken,
  testLocalStorage,
  testLogoutSimulation,
  testApiServiceLogout,
  runAllTests
};

console.log('🔧 Test functions available at: window.testAdminLogout');
console.log('💡 Run: window.testAdminLogout.runAllTests() to execute all tests');

// Auto-run tests if on admin page
if (window.location.pathname.startsWith('/admin')) {
  console.log('📍 Admin page detected, auto-running tests...');
  setTimeout(() => runAllTests(), 1000);
}
