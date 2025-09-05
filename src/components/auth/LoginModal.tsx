"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { sendOTP, verifyOTP, signOut, loading, error, clearError, isAuthenticated, user } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle resend timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
      setShowOTP(true);
      setResendTimer(60); // 60 seconds resend timer
      clearError();
    } catch (err) {
      // Error is already handled by the context
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(otp);
      onClose();
      clearError();
    } catch (err) {
      // Error is already handled by the context
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
      setResendTimer(60);
      setOtp("");
      clearError();
    } catch (err) {
      // Error is already handled by the context
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowOTP(false);
      setPhoneNumber("");
      setOtp("");
      onClose();
    } catch (err) {
      // Error is already handled by the context
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX for Indian numbers
    if (cleaned.length <= 10) {
      if (cleaned.length <= 5) {
        return cleaned;
      }
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    
    // For numbers with country code
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  if (isAuthenticated && user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Authenticated Successfully</p>
                <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                {user.displayName && (
                  <p className="text-sm text-muted-foreground">{user.displayName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Shopping
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showOTP ? "Enter OTP" : "Login to Spiritual Store"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Badge variant="secondary">Secure Authentication</Badge>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showOTP ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">
                  We'll send a 6-digit OTP to this number
                </p>
              </div>

              <Button 
                onClick={handleSendOTP} 
                disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter 6-digit OTP</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Resend OTP in {resendTimer}s</span>
                    </div>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp("");
                    clearError();
                  }}
                  className="w-full text-sm"
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}

          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
            <p>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="mt-1">
              Your phone number is securely encrypted and never shared with third parties
            </p>
          </div>
        </div>

        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" />
      </DialogContent>
    </Dialog>
  );
}