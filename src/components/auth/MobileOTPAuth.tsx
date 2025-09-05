"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  User, 
  Mail, 
  ArrowRight,
  ArrowLeft,
  Smartphone,
  MessageCircle,
  Shield,
  CheckCircle
} from "lucide-react";
import { authService } from "@/lib/firebase/auth-service";
import { useRouter } from "next/navigation";

interface AuthStep {
  type: "phone" | "otp" | "profile" | "success";
}

interface UserProfile {
  fullName: string;
  email: string;
}

export function MobileOTPAuth() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AuthStep["type"]>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: ""
  });
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const containerId = "recaptcha-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }
    
    authService.initRecaptcha(containerId);
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.sendOTP(phoneNumber);
      setConfirmationResult(result);
      setCurrentStep("otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await authService.verifyOTP(otp, confirmationResult);
      setUid(user.uid);
      
      // Check if user needs to complete profile
      const needsProfile = await authService.needsProfileCompletion(user.uid);
      
      if (needsProfile) {
        setCurrentStep("profile");
      } else {
        setCurrentStep("success");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!userProfile.fullName.trim() || !userProfile.email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userProfile.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (uid) {
        await authService.completeUserProfile(uid, userProfile);
        setCurrentStep("success");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error completing profile:", error);
      setError(error.message || "Failed to complete profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.sendOTP(phoneNumber);
      setConfirmationResult(result);
      setOtp("");
      setError("OTP resent successfully!");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Welcome to Spiritual Store</h3>
        <p className="text-muted-foreground">
          Enter your phone number to receive a 6-digit OTP for verification
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex">
            <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
              <span className="text-sm font-medium">+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              className="rounded-l-none text-lg"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleSendOTP}
          disabled={isLoading || phoneNumber.length !== 10}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Enter Verification Code</h3>
        <p className="text-muted-foreground">
          We've sent a 6-digit OTP to +91{phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="text-center text-xl tracking-widest font-mono"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>

        <div className="text-center space-y-2">
          <Button 
            variant="link" 
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm"
          >
            Resend OTP
          </Button>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <Button 
              variant="link" 
              onClick={() => {
                setCurrentStep("phone");
                setOtp("");
                setError("");
              }}
              className="text-sm p-0 h-auto"
            >
              Change Phone Number
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-muted-foreground">
          Please provide your details to complete your registration
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={userProfile.fullName}
              onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={userProfile.email}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Phone Number:</span>
            <span>+91{phoneNumber}</span>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleCompleteProfile}
          disabled={isLoading || !userProfile.fullName.trim() || !userProfile.email.trim()}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isLoading ? "Completing Profile..." : "Complete Profile"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold mb-2">Welcome to Spiritual Store!</h3>
        <p className="text-muted-foreground">
          Your account has been created successfully. Redirecting to homepage...
        </p>
      </div>

      <div className="space-y-2">
        <Badge variant="secondary" className="text-sm">
          <Shield className="mr-1 h-3 w-3" />
          Account Verified
        </Badge>
        <div className="text-sm text-muted-foreground">
          Phone: +91{phoneNumber}
        </div>
        {userProfile.fullName && (
          <div className="text-sm text-muted-foreground">
            Name: {userProfile.fullName}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary-foreground font-bold">स</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Spiritual Store</h1>
          <p className="text-muted-foreground">Mobile OTP Authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === "phone" && "Enter Phone Number"}
              {currentStep === "otp" && "Verify OTP"}
              {currentStep === "profile" && "Complete Profile"}
              {currentStep === "success" && "Success!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === "phone" && renderPhoneStep()}
            {currentStep === "otp" && renderOTPStep()}
            {currentStep === "profile" && renderProfileStep()}
            {currentStep === "success" && renderSuccessStep()}
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            {["phone", "otp", "profile", "success"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStep === step || 
                    (step === "otp" && currentStep === "profile") ||
                    (step === "otp" && currentStep === "success") ||
                    (step === "profile" && currentStep === "success")
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      (step === "phone" && currentStep !== "phone") ||
                      (step === "otp" && currentStep !== "otp" && currentStep !== "phone") ||
                      (step === "profile" && currentStep === "success")
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}