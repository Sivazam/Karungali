import { auth, db } from "@/lib/firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  updateProfile,
  signOut as firebaseSignOut
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileCompleted: boolean;
  avatar?: string;
  addresses?: Array<{
    id: string;
    type: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA
  initRecaptcha(containerId: string = "recaptcha-container"): RecaptchaVerifier {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: (response: string) => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      });
    }
    return this.recaptchaVerifier;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized");
    }

    try {
      const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        this.recaptchaVerifier
      );
      
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  // Verify OTP and complete sign in/up
  async verifyOTP(otp: string, confirmationResult: ConfirmationResult): Promise<User> {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Check if user profile exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // New user - create basic profile
        await setDoc(userDocRef, {
          uid: user.uid,
          fullName: "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          profileCompleted: false,
        });
      } else {
        // Existing user - update last login
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
      }
      
      return user;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  // Complete user profile after OTP verification
  async completeUserProfile(uid: string, profileData: {
    fullName: string;
    email: string;
  }): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);
      
      await updateDoc(userDocRef, {
        fullName: profileData.fullName,
        email: profileData.email,
        updatedAt: serverTimestamp(),
        profileCompleted: true,
      });

      // Also update Firebase Auth profile
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === uid) {
        await updateProfile(currentUser, {
          displayName: profileData.fullName,
        });
      }
    } catch (error) {
      console.error("Error completing user profile:", error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: data.uid,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate(),
          profileCompleted: data.profileCompleted || false,
          avatar: data.avatar,
          addresses: data.addresses || [],
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Check if user needs to complete profile
  async needsProfileCompletion(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return !profile?.profileCompleted;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);
      
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Sign out current user
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Get current authenticated user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Format phone number for India
  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+91${cleaned.substring(1)}`;
    }
    
    return phoneNumber;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

// Export singleton instance
export const authService = new AuthService();