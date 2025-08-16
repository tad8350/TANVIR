# Admin Logout Functionality Guide

## Overview

The admin logout functionality has been completely implemented and centralized across all admin pages. This ensures consistent behavior and proper cleanup of authentication state when administrators log out.

## Features

### ✅ Complete Authentication Cleanup
- Clears admin authentication token (`admin_token` cookie)
- Removes all admin-related localStorage data
- Cleans up form drafts and session data
- Redirects to admin signin page
- Shows success notification

### ✅ Centralized Implementation
- Single `adminLogout()` function in `@/lib/admin-auth`
- Consistent behavior across all admin pages
- Easy to maintain and update

### ✅ Security Features
- Authentication checks on all admin pages
- Automatic redirect if not authenticated
- Loading states during authentication checks

## Implementation Details

### Core Logout Function

```typescript
// Located in: src/lib/admin-auth.ts
export const adminLogout = (router: any) => {
  try {
    // Clear authentication state using API service
    apiService.logout();
    
    // Clear localStorage data
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('brandFormDraft');
    localStorage.removeItem('productFormDraft');
    
    // Clear cookies
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Show success message
    toast.success('Successfully logged out!', {
      duration: 2000,
      position: 'top-center',
    });
    
    // Redirect to admin signin page
    router.push('/admin/signin');
  } catch (error) {
    console.error('Logout error:', error);
    router.push('/admin/signin');
  }
};
```

### Usage in Admin Pages

All admin pages now use the centralized logout function:

```typescript
import { adminLogout } from "@/lib/admin-auth";

const handleLogout = () => {
  adminLogout(router);
};
```

## Admin Pages with Logout

The following admin pages have been updated with the new logout functionality:

1. **Dashboard** (`/admin/dashboard`)
2. **Brands List** (`/admin/brands`)
3. **Add Brand** (`/admin/brands/add`)
4. **Products List** (`/admin/products`)
5. **Add Product** (`/admin/products/add`)

## Authentication Checks

### Automatic Authentication Verification

All admin pages now include authentication checks:

```typescript
import { requireAdminAuth } from "@/lib/admin-auth";

useEffect(() => {
  requireAdminAuth(router);
}, [router]);
```

### Loading States

Authentication checks include loading states to prevent page flashing:

```typescript
export const checkAdminAuth = (): { loading: boolean; authenticated: boolean } => {
  if (typeof document === 'undefined') {
    return { loading: true, authenticated: false };
  }
  
  const token = getAdminToken();
  return { loading: false, authenticated: !!token };
};
```

## Testing

### Manual Testing

1. Navigate to any admin page
2. Open browser console
3. Run the test script: `window.testAdminLogout.runAllTests()`

### Test Script

A comprehensive test script is available at `test-admin-logout.js` that verifies:
- Admin token existence
- LocalStorage data presence
- Logout simulation
- API service availability

## Security Features

### Cookie Management
- Secure cookie expiration
- Path-specific cookie clearing
- Multiple cookie cleanup (admin_token, admin_user, token, user)

### LocalStorage Cleanup
- Complete removal of admin session data
- Form draft cleanup
- User preference removal

### Redirect Protection
- Automatic redirect to signin if not authenticated
- Prevents access to admin pages without proper authentication

## Error Handling

### Graceful Fallbacks
- Logout continues even if some cleanup fails
- Automatic redirect on errors
- Console logging for debugging

### User Feedback
- Success notifications on successful logout
- Error notifications for authentication issues
- Loading states during authentication checks

## Maintenance

### Adding New Admin Pages

To add logout functionality to a new admin page:

1. Import the logout function:
```typescript
import { adminLogout } from "@/lib/admin-auth";
```

2. Add authentication check:
```typescript
import { requireAdminAuth } from "@/lib/admin-auth";

useEffect(() => {
  requireAdminAuth(router);
}, [router]);
```

3. Implement logout handler:
```typescript
const handleLogout = () => {
  adminLogout(router);
};
```

### Updating Logout Behavior

To modify logout behavior, update the `adminLogout` function in `src/lib/admin-auth.ts`. Changes will automatically apply to all admin pages.

## Troubleshooting

### Common Issues

1. **Logout not working**: Check if `apiService.logout()` is available
2. **Page not redirecting**: Verify router is properly passed to `adminLogout`
3. **Authentication errors**: Check browser console for error messages

### Debug Mode

Enable debug mode by running the test script in browser console:
```javascript
window.testAdminLogout.runAllTests()
```

## Future Enhancements

### Planned Features
- Session timeout handling
- Remember me functionality
- Multi-factor authentication support
- Audit logging for logout events

### Integration Points
- Backend session management
- Real-time authentication status
- Cross-tab logout synchronization

## Support

For issues or questions about the admin logout functionality:
1. Check browser console for error messages
2. Run the test script to verify functionality
3. Review this documentation for implementation details
4. Check the admin-auth utility file for function definitions
