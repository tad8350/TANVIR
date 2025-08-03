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

      // Store the token and user data in cookies
      document.cookie = `token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      toast.success('Login successful! Welcome back to TAD.', {
        duration: 3000, // Show for only 3 seconds
        dismissible: true, // Allow manual dismissal
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
        position: 'top-center', // Position in center-top instead of top-right
      });

      // Redirect to homepage after successful login
      router.push('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Fashion Model Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
             }}>
          <div className="w-full h-full bg-black/10"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 rounded-2xl">
            {/* Brand Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif text-white font-bold mb-2">TAD</h1>
              <p className="text-white/80 text-sm tracking-wider">TRENDS. ACCESS. DIVERSITY</p>
              <p className="text-white/60 text-xs mt-2">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 py-2 text-white placeholder:text-white/50 focus:border-white/60 focus:ring-0 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                  {formData.email && (
                    <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/30 rounded-none px-0 py-2 text-white placeholder:text-white/50 focus:border-white/60 focus:ring-0 transition-colors pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 px-2 text-white/60">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <GoogleSignInButton />

              {/* Alternative Button */}
              <Link href="/auth/signup">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full bg-black text-white border-black hover:bg-gray-900 hover:text-white py-3 rounded-xl transition-all duration-200"
                >
                  Create Customer Account
                </Button>
              </Link>

              {/* Admin/Brand Notice */}
              <div className="text-center mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs mb-2">Admin or Brand User?</p>
                <p className="text-white/40 text-xs">
                  Admin and brand accounts must be created by administrators. 
                  Contact your system administrator for access.
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-white/60 text-xs">Privacy Policy | Terms of Service</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 