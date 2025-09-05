"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowLeft,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    clearAuth,
    clearAuthError,
    isLoading,
    signUp,
    error,
    isAuthenticated,
  
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      clearAuthError();
    }
  }, [formData, clearAuthError , error]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      clearAuth();
    }
  }, [clearAuth, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match. Please try again.",
      });
      return;
    }
    try {
      const result = await signUp(formData);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Account created successfully", {
          description: "Please check your email for verification.",
        });
        // Redirect to email verification
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: unknown) {
      if(error instanceof Error) {
          toast.error(error.message, {
        description: "Something went wrong. Please try again.",
      });
      }else{
        toast.error("Signup failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
      
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Zap className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Nexus
                </h1>
                <p className="text-sm text-muted-foreground">
                  Project Management
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-gray-100 dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
                Join thousands of teams
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Start your journey with Nexus today. Create your account and
                experience the future of project management.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  Collaborate with your team
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  Enterprise-grade security
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium">AI-powered insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4 pb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white h-4 w-4" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Nexus
                </span>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
                <CardDescription className="text-base">
                  Get started with Nexus today
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>

                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-sm hover:scale-105 transition-transform duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
