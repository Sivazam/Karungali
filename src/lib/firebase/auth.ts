import { auth } from "./firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult
} from "firebase/auth";

export interface AuthUser {
  uid: string;
  phoneNumber: string;
  email?: string;
  displayName?: string;
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA
  initRecaptcha(containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: (response: string) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
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
      
      // Save confirmation result for later use
      localStorage.setItem('confirmationResult', JSON.stringify({
        verificationId: confirmationResult.verificationId
      }));
      
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  // Verify OTP and complete sign in
  async verifyOTP(otp: string): Promise<AuthUser> {
    try {
      const confirmationResultData = localStorage.getItem('confirmationResult');
      if (!confirmationResultData) {
        throw new Error("No confirmation result found");
      }

      const { verificationId } = JSON.parse(confirmationResultData);
      
      // Create a confirmation result object
      const confirmationResult = {
        confirm: (otp: string) => {
          return auth.signInWithCredential(verificationId, otp);
        }
      } as any;

      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Clear stored confirmation result
      localStorage.removeItem('confirmationResult');
      
      return {
        uid: user.uid,
        phoneNumber: user.phoneNumber || "",
        email: user.email || undefined,
        displayName: user.displayName || undefined,
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  // Sign out current user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      phoneNumber: user.phoneNumber || "",
      email: user.email || undefined,
      displayName: user.displayName || undefined,
    };
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({
          uid: user.uid,
          phoneNumber: user.phoneNumber || "",
          email: user.email || undefined,
          displayName: user.displayName || undefined,
        });
      } else {
        callback(null);
      }
    });
  }

  // Format phone number for India
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with +91, return as is
    if (cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    // If number is 10 digits (Indian number without country code)
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If number starts with 0 and has 11 digits (Indian number with 0 prefix)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+91${cleaned.substring(1)}`;
    }
    
    // Return as is if already in international format
    return phoneNumber;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

// Export singleton instance
export const authService = new AuthService();