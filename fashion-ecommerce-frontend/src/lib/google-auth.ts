// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Google OAuth URL
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

// Google OAuth Scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

// Google OAuth Configuration
export const getGoogleAuthConfig = (redirectUri: string) => ({
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: GOOGLE_SCOPES,
  access_type: 'offline',
  prompt: 'consent'
});

// Build Google OAuth URL
export const buildGoogleAuthUrl = (redirectUri: string) => {
  const config = getGoogleAuthConfig(redirectUri);
  const params = new URLSearchParams(config);
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}; 