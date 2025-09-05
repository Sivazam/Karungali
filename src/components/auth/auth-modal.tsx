"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  CheckCircle,
  Clock
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

interface AuthModalProps {
  children: React.ReactNode;
}

export function AuthModal({ children }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const setupRecaptcha = () => {
    if (!auth) return;
    
    // @ts-ignore
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier;
      const fullPhoneNumber = `+91${phoneNumber}`;
      
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setVerificationId(result.verificationId);
      setOtpSent(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!verificationId || !otp) {
      alert("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      // @ts-ignore
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth.signInWithCredential(credential);
      setIsOpen(false);
      // Reset form
      setPhoneNumber("");
      setOtp("");
      setOtpSent(false);
      setVerificationId(null);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        if (!fullName) {
          alert("Please enter your full name");
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      setIsOpen(false);
      // Reset form
      setEmail("");
      setPassword("");
      setFullName("");
      setIsSignUp(false);
    } catch (error: any) {
      console.error("Email auth error:", error);
      alert(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp("");
    setVerificationId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Welcome to Spiritual Store
          </DialogTitle>
        </DialogHeader>

        <div id="recaptcha-container"></div>

        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "phone" | "email")}>
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
            {!otpSent ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your phone number to receive OTP
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 py-2 border rounded-md bg-muted">
                      <span className="text-sm">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendOTP}
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <div className="font-medium mb-1">Secure Verification</div>
                      <div>We'll send a 6-digit OTP to verify your phone number. Your number is safe with us.</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">OTP Sent</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter 6-digit OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <Button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button 
                    variant="link" 
                    onClick={resetPhoneAuth}
                    className="p-0 h-auto text-xs"
                  >
                    Change Number
                  </Button>
                  <Button 
                    variant="link" 
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="p-0 h-auto text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Resend OTP
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Email Authentication */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleEmailAuth}
                disabled={loading || !email || !password || (isSignUp && !fullName)}
                className="w-full"
              >
                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp 
                    ? "Already have an account? Sign In" 
                    : "Don't have an account? Sign Up"
                  }
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <div className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}