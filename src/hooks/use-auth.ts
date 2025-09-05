"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authService } from "@/lib/firebase/auth-service";

interface AuthUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  profileCompleted?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        
        setUser(authUser);
        
        // Fetch user profile from Firestore
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
          
          // Update authUser with profile completion status
          setUser(prev => prev ? { ...prev, profileCompleted: profile?.profileCompleted || false } : null);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
  };
}