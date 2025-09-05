"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  User, 
  Lock, 
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Smartphone,
  MessageCircle
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult 
} from "firebase/auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const initializeRecaptcha = () => {
    if (!auth) return;
    
    // @ts-ignore - RecaptchaVerifier is available but types might not be up to date
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('reCAPTCHA solved');
      }
    });
  };

  const handlePhoneAuth = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    try {
      initializeRecaptcha();
      
      const appVerifier = window.recaptchaVerifier;
      const fullPhoneNumber = `+91${phoneNumber}`;
      
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      alert(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult || !otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("Phone auth successful:", result.user);
      alert("Login successful!");
      // TODO: Redirect to dashboard or home page
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (authMode === "register" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === "login") {
        // TODO: Implement email login
        console.log("Email login:", { email, password });
        alert("Email login coming soon!");
      } else {
        // TODO: Implement email registration
        console.log("Email registration:", { email, password, fullName });
        alert("Email registration coming soon!");
      }
    } catch (error: any) {
      console.error("Email auth error:", error);
      alert(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary-foreground font-bold">स</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Spiritual Store</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              {/* Phone Authentication */}
              <TabsContent value="phone" className="space-y-4">
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Smartphone className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        We'll send a 6-digit OTP to your phone number
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                          <span className="text-sm">+91</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handlePhoneAuth}
                      disabled={isLoading || phoneNumber.length !== 10}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit OTP sent to +91{phoneNumber}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                    </div>

                    <Button 
                      onClick={verifyOTP}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setConfirmationResult(null);
                          setOtp("");
                        }}
                        className="text-sm"
                      >
                        Change Phone Number
                      </Button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Options */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </TabsContent>

              {/* Email Authentication */}
              <TabsContent value="email" className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={authMode === "login" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setAuthMode("login")}
                      className="text-sm"
                    >
                      Login
                    </Button>
                    <Button
                      variant={authMode === "register" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setAuthMode("register")}
                      className="text-sm"
                    >
                      Register
                    </Button>
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-4">
                  {authMode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
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

                  {authMode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading 
                      ? (authMode === "login" ? "Signing in..." : "Creating account...")
                      : (authMode === "login" ? "Sign In" : "Create Account")
                    }
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Options */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* reCAPTCHA Container */}
            <div id="recaptcha-container"></div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure Login
            </Badge>
            <Badge variant="outline" className="text-xs">
              100% Private
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}