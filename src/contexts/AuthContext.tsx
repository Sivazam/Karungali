"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser } from "@/lib/firebase/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize reCAPTCHA
      const containerId = "recaptcha-container";
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
      }
      
      authService.initRecaptcha(containerId);
      await authService.sendOTP(phoneNumber);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await authService.verifyOTP(otp);
      setUser(authUser);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    sendOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!user,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}