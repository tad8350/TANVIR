# Google OAuth Setup Guide

## 🚨 **FIX: Authorization Error**

If you're getting "OAuth client was not found" error, follow these steps:

### **Step 1: Create Google OAuth Credentials**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Search for "Google OAuth2 API" and enable it
4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - **Name:** "TAD Fashion Ecommerce"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://yourdomain.com (for production)
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (for production)
     ```
5. **Copy the credentials:**
   - **Client ID:** Copy this value
   - **Client Secret:** Copy this value

### **Step 2: Update Environment Variables**

Replace the placeholder values in your `.env` file:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_client_secret_here
```

**⚠️ Important:**
- Replace `123456789-abcdefghijklmnop.apps.googleusercontent.com` with your actual Client ID
- Replace `GOCSPX-your_actual_client_secret_here` with your actual Client Secret
- The Client ID should end with `.apps.googleusercontent.com`
- The Client Secret should start with `GOCSPX-`

### **Step 3: Restart Your Development Server**

After updating the environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 4: Test the Integration**

1. **Go to:** `http://localhost:3000/auth/signin`
2. **Click "Continue with Google"**
3. **Complete the OAuth flow**

## 🔍 **Troubleshooting**

### **Error: "OAuth client was not found"**
- ✅ **Check:** Is your Client ID correct in `.env`?
- ✅ **Check:** Did you restart the development server?
- ✅ **Check:** Is the Client ID from the correct Google project?

### **Error: "Invalid redirect_uri"**
- ✅ **Check:** Is the redirect URI exactly `http://localhost:3000/api/auth/google/callback`?
- ✅ **Check:** Did you add it to Google Cloud Console?

### **Error: "Client ID not found"**
- ✅ **Check:** Is `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set correctly?
- ✅ **Check:** Does the Client ID end with `.apps.googleusercontent.com`?

## 📋 **Quick Test**

To verify your configuration is working:

1. **Check environment variable:**
   ```javascript
   // In browser console:
   console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
   ```

2. **Should show:** Your actual Client ID (not placeholder)

## 🎯 **Common Issues**

- **Wrong project:** Make sure you're using credentials from the correct Google Cloud project
- **Wrong redirect URI:** Must be exactly `http://localhost:3000/api/auth/google/callback`
- **Not restarted:** Environment variables require server restart
- **Wrong Client ID format:** Should end with `.apps.googleusercontent.com`

## ✅ **Success Indicators**

When working correctly:
- ✅ Google sign-in button appears
- ✅ Clicking button redirects to Google
- ✅ Google shows consent screen
- ✅ After consent, redirects back to your app
- ✅ User is logged in and redirected to homepage 