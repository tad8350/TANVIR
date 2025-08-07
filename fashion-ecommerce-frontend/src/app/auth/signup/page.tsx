"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          user_type: 'customer', // Only customers can register publicly
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful! Please sign in with your credentials.');
      
      // Redirect to signin page after successful registration
      router.push('/auth/signin');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
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

      {/* Right Side - Neumorphic Form */}
      <div className="w-full lg:w-1/2 bg-[#f2f5f9] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Neumorphic Card Container */}
          <div className="bg-gray-50 rounded-3xl p-6 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] border border-gray-200/50">
            {/* Brand Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-serif text-[#3D98B4] font-bold mb-2">TAD</h1>
              <p className="text-gray-600 text-sm tracking-wider">TRENDS. ACCESS. DIVERSITY</p>
              <p className="text-gray-500 text-xs mt-2">Create your customer account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 text-sm font-medium">
                  First Name
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 text-sm font-medium">
                  Last Name
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    placeholder="Enter your email"
                    required
                  />
                  {formData.email && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    placeholder="Enter your phone number"
                    required
                  />
                  {formData.phone && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] pr-12"
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl px-3 py-2.5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] pr-12"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button - Gradient Shadow Style */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#3D98B4] to-[#2563eb] hover:from-[#2E7A8F] hover:to-[#1d4ed8] text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_25px_rgba(61,152,180,0.3)] hover:shadow-[0_12px_35px_rgba(61,152,180,0.4)] active:shadow-[0_4px_15px_rgba(61,152,180,0.5)]"
              >
                {isLoading ? "Creating Account..." : "SIGN UP"}
              </Button>

              {/* Already a member text */}
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">Already a member?</p>
              </div>

              {/* Alternative Button - Dot Expand Style */}
              <Link href="/auth/signin">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full bg-white text-[#3D98B4] border-2 border-[#3D98B4] hover:bg-[#3D98B4] hover:text-white py-3 rounded-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">Sign in Now</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-[#3D98B4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Button>
              </Link>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-xs">Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 