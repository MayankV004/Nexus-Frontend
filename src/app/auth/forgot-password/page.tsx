"use client";

import type React from "react";

import { useState } from "react";
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
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Mail, Zap, Shield, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { isLoading, forgotPass } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Password reset request for:", email);
      const res = await forgotPass({ email });
      if (res.meta.requestStatus === "fulfilled") {
        setIsSubmitted(true);

        toast.success("Reset link sent", {
          description: "Check your email for password reset instructions.",
        });
        router.push("/auth/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          description: "Please try again later.",
        });
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 flex items-center justify-center p-4">
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
                <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-orange-800 to-blue-800 dark:from-gray-100 dark:via-orange-200 dark:to-blue-200 bg-clip-text text-transparent">
                  Check your email
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We&apos;ve sent password reset instructions to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    <Mail className="text-white h-5 w-5" />
                  </div>
                  <span className="font-semibold text-green-900 dark:text-green-100">
                    Email sent successfully
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Follow the instructions in the email to reset your password.
                </p>
                <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                  <Clock className="h-3 w-3" />
                  <span>Link expires in 1 hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Success Card */}
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

                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    Check your email
                  </CardTitle>
                  <CardDescription className="text-base">
                    We&apos;ve sent password reset instructions to {email}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive the email? Check your spam folder or try
                    again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    Try again
                  </Button>
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="w-full hover:scale-105 transition-transform duration-200"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 flex items-center justify-center p-4">
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
              <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-orange-800 to-blue-800 dark:from-gray-100 dark:via-orange-200 dark:to-blue-200 bg-clip-text text-transparent">
                Forgot your password?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No worries! Enter your email address and we&apos;ll send you a
                link to reset your password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  Secure password reset
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  Link expires in 1 hour
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
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
                  Forgot your password?
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-sm hover:scale-105 transition-transform duration-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
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
