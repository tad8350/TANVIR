"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/auth/google-signin-button";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth errors in URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      switch (error) {
        case 'google_auth_failed':
          toast.error('Google authentication failed. Please try again.');
          break;
        case 'no_auth_code':
          toast.error('No authorization code received from Google.');
          break;
        case 'token_exchange_failed':
          toast.error('Failed to exchange authorization code. Please try again.');
          break;
        case 'user_info_failed':
          toast.error('Failed to get user information from Google.');
          break;
        case 'backend_auth_failed':
          toast.error('Backend authentication failed. Please try again.');
          break;
        case 'oauth_error':
          toast.error('OAuth error occurred. Please try again.');
          break;
        default:
          toast.error('An error occurred during Google authentication.');
      }
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Clear any existing invalid cookies first
      const cookiesToClear = ['user', 'token', 'auth', 'session', 'refresh'];
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname};`;
      });

      // Store the token and user data in cookies with proper validation
      if (data.access_token && data.user && data.user.id && data.user.email) {
        document.cookie = `token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        toast.success('Login successful! Welcome back to TAD.', {
          duration: 3000,
          dismissible: true,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(),
          },
          position: 'top-center',
        });

        // Use window.location.href for more reliable redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        throw new Error('Invalid response data from server');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      
      // Clear any partial cookies on error
      const cookiesToClear = ['user', 'token', 'auth', 'session', 'refresh'];
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname};`;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Fashion Model Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#A5AAB3] to-[#3D98B4]">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
             }}>
          <div className="w-full h-full bg-black/10"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#3D98B4] via-[#A5AAB3] to-[#3D98B4] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 p-8 rounded-2xl shadow-xl">
            {/* Brand Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif text-white font-bold mb-2">TAD</h1>
              <p className="text-white/90 text-sm tracking-wider">TRENDS. ACCESS. DIVERSITY</p>
              <p className="text-white/70 text-xs mt-2">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/95 text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    placeholder="Enter your email"
                    required
                  />
                  {formData.email && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/95 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button - Gradient Shadow Style */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#3D98B4] to-[#2563eb] hover:from-[#2E7A8F] hover:to-[#1d4ed8] text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_25px_rgba(61,152,180,0.3)] hover:shadow-[0_12px_35px_rgba(61,152,180,0.4)] active:shadow-[0_4px_15px_rgba(61,152,180,0.5)]"
              >
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-[#3D98B4] via-[#A5AAB3] to-[#3D98B4] px-2 text-white/80">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <GoogleSignInButton />

              {/* New member text */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">New to TAD?</p>
              </div>

              {/* Alternative Button - Dot Expand Style */}
              <Link href="/auth/signup">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full bg-white text-[#3D98B4] border-2 border-[#3D98B4] hover:bg-[#3D98B4] hover:text-white py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">Create Customer Account</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-[#3D98B4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Button>
              </Link>

              {/* Admin/Brand Notice */}
              <div className="text-center mt-4 p-4 bg-white/10 rounded-lg">
                <p className="text-white/80 text-xs mb-2">Admin or Brand User?</p>
                <p className="text-white/60 text-xs">
                  Admin and brand accounts must be created by administrators. 
                  Contact your system administrator for access.
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-white/70 text-xs">Privacy Policy | Terms of Service</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 