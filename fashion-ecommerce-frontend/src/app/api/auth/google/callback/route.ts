import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/auth/signin?error=google_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/signin?error=no_auth_code', request.url));
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/auth/signin?error=token_exchange_failed', request.url));
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info:', userInfo);
      return NextResponse.redirect(new URL('/auth/signin?error=user_info_failed', request.url));
    }

    // Send user info to your backend for authentication/registration
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        googleId: userInfo.id,
        picture: userInfo.picture,
      }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('Backend authentication failed:', backendData);
      return NextResponse.redirect(new URL('/auth/signin?error=backend_auth_failed', request.url));
    }

    // Set cookies and redirect to homepage with a parameter to force refresh
    const response = NextResponse.redirect(new URL('/?auth=success', request.url));
    
    console.log('Setting cookies for user:', backendData.user);
    
    response.cookies.set('token', backendData.access_token, {
      httpOnly: false, // Allow JavaScript to read this cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set('user', JSON.stringify(backendData.user), {
      httpOnly: false, // Allow JavaScript to read this cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    console.log('Cookies set, redirecting to homepage');

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=oauth_error', request.url));
  }
} 