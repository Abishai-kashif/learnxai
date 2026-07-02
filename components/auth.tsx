"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BookOpen, Shield, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./forms/login-form";
import SignupForm from "./forms/signup-form";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const authMethod = (searchParams.get("auth") as "login" | "signup") || "login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20"></div>
      
      <div className="relative w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-col space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  LearnXai
                </h1>
                <p className="text-slate-600 text-lg">AI-Powered Learning Platform</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Adaptive Learning</h3>
                <p className="text-slate-600">Personalized quizzes that adapt to your learning pace and style</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Secure & Private</h3>
                <p className="text-slate-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Collaborative</h3>
                <p className="text-slate-600">Learn together with peers and track progress in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl shadow-orange-500/10">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-slate-900 font-bold">
                Get Started
              </CardTitle>
              <CardDescription className="text-center text-slate-600 text-base">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <Tabs defaultValue={authMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger 
                    value="login" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-0">
                  <LoginForm showPassword={showPassword} setShowPassword={setShowPassword} />
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <SignupForm 
                    showPassword={showPassword} 
                    setShowPassword={setShowPassword} 
                    setShowConfirmPassword={setShowConfirmPassword} 
                    showConfirmPassword={showConfirmPassword} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-3">Trusted by thousands of learners worldwide</p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                10k+ Users
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}