"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter , useSearchParams } from "next/navigation"
import { Mail, Zap, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("")
  // const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const { isLoading , verifyUserEmail , resendVerification , clearAuthError, error } = useAuth();
  useEffect(() => {
      if (error) {
        clearAuthError();
      }
    }, [otp , clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email ){
      toast.error("Email is required", {
        description: "Please provide a valid email address.",
      })
      return;
    }
    try {
      if (otp.length !== 6) {
        toast.error("Invalid OTP", {
          description: "Please enter a valid 6-digit OTP.",
        })
        return;
      }
      const result = await verifyUserEmail({otp , email})
      if(result.meta.requestStatus === "fulfilled")
      { 
        toast.success("Email verified successfully", {
        description: "Your account has been activated.",
      })

      router.push("/dashboard")

      }
      
    } catch (error) {
      toast.error("Verification failed", {
        description: "Invalid OTP. Please try again.",
      })
    } 
  }

  const handleResendOTP = async () => {
    setIsResending(true)

    try {
      
      if (!email) {
        toast.error("Email is required", {
          description: "Please provide a valid email address.",
        })
        return
      }
      const result = await resendVerification(email)
      if (result.meta.requestStatus === "fulfilled") {
        setOtp("") // Clear the OTP input field
      }
      if (result.payload.data?.email) {
        toast.success("OTP resent successfully", {
          description: `A new verification code has been sent to ${result.payload.data.email}.`,
        })
      } else {
        toast.error("Failed to resend OTP", {
          description: "Please try again later.",
        })
      }
    } catch (error:any) {
      toast.error("Failed to resend OTP", {
        description: "Please try again later.",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center p-4">
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
                <p className="text-sm text-muted-foreground">Project Management</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 dark:from-gray-100 dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent">
                Almost there!
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've sent a verification code to your email. Enter it below to activate your account and start your
                journey with Nexus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                  <Mail className="text-white h-5 w-5" />
                </div>
                <span className="font-semibold text-green-900 dark:text-green-100">Check your inbox</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                We've sent a 6-digit verification code to your email address.
              </p>
              <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                <span>Code expires in 10 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Verification Form */}
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
                <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                <CardDescription className="text-base">
                  Enter the 6-digit code we sent to your email address
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="h-11 text-center text-lg tracking-widest transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Resending...
                    </div>
                  ) : (
                    "Resend Code"
                  )}
                </Button>

                <Link href="/auth/login">
                  <Button variant="ghost" className="text-sm hover:scale-105 transition-transform duration-200">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
