"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Building2 } from "lucide-react";
import { useState } from "react";
import { apiService, BrandLoginResponse } from "@/lib/api";

export default function BrandSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log('Attempting brand login with:', formData);

    try {
      const response: BrandLoginResponse = await apiService.brandLogin(formData.email, formData.password);
      console.log('Brand login successful:', response);
      
      // Check if we have the token
      if (response.access_token) {
        console.log('Token received, redirecting to brand dashboard...');
        console.log('🔍 Router object:', router);
        console.log('🔍 Current pathname:', window.location.pathname);
        
        // Use window.location.href for more reliable redirect
        console.log('🔍 Using window.location.href for redirect...');
        try {
          window.location.href = "/brand/dashboard";
          console.log('✅ window.location.href redirect initiated');
        } catch (error) {
          console.error('❌ window.location.href failed:', error);
          // Fallback: try router.push
          console.log('🔍 Trying router.push fallback...');
          router.push("/brand/dashboard");
        }
      } else {
        console.error('No access token in response:', response);
        setError('Login successful but no token received');
      }
    } catch (error: any) {
      console.error('Brand login failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to your brand account</p>
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center">Brand Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your brand credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="brand@example.com" 
                    className="pl-10" 
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-10 pr-10" 
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Forgot your password? Contact platform administrator
          </p>
        </div>
      </div>
    </div>
  );
}
