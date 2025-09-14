"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-secondary hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to learnXai
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-foreground/70">Continue your learning journey</p>
        </div>

        <Card className="border border-foreground bg-orange-50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-foreground">Get Started</CardTitle>
            <CardDescription className="text-center text-foreground/70">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={authMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-background">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* ----------------------
                  Sign In Tab Content
                  ---------------------- */}
              <TabsContent value="login" className="space-y-4">
									<LoginForm showPassword={showPassword} setShowPassword={setShowPassword} />
              </TabsContent>

              {/* ----------------------
                  Sign Up Tab Content
                  ---------------------- */}
              <TabsContent value="signup" className="space-y-4">
								<SignupForm showPassword={showPassword} setShowPassword={setShowPassword} setShowConfirmPassword={setShowConfirmPassword} showConfirmPassword={showConfirmPassword} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}