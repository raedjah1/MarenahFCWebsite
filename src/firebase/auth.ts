// Firebase Authentication Service
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
  AuthError,
  IdTokenResult,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { FirebaseUser, AdminClaims } from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const USERS_COLLECTION = 'users';
const ADMIN_EMAILS = [
  'admin@marenahfc.com',
  'manager@marenahfc.com',
  // Add more admin emails as needed
];

// ============================================================================
// TYPES
// ============================================================================

export interface AuthResult {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// AUTH SERVICE CLASS
// ============================================================================

class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    this.auth = auth;
  }

  // ==========================================================================
  // AUTHENTICATION METHODS
  // ==========================================================================

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Check if user has admin privileges
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const isAdmin = this.checkAdminClaims(idTokenResult) || ADMIN_EMAILS.includes(email);

      if (!isAdmin) {
        await this.signOut();
        return {
          success: false,
          error: 'Access denied. Admin privileges required.',
        };
      }

      // Update user's last login
      await this.updateUserProfile(userCredential.user, { isAdmin });

      const firebaseUser = await this.createFirebaseUserObject(userCredential.user);

      return {
        success: true,
        user: firebaseUser,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error as AuthError),
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Check if current user is admin
   */
  async isCurrentUserAdmin(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    try {
      const idTokenResult = await user.getIdTokenResult();
      return this.checkAdminClaims(idTokenResult) || ADMIN_EMAILS.includes(user.email || '');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Set up auth state observer
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        try {
          const firebaseUser = await this.createFirebaseUserObject(user);
          callback(firebaseUser);
        } catch (error) {
          console.error('Error creating Firebase user object:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // ==========================================================================
  // USER PROFILE METHODS
  // ==========================================================================

  /**
   * Create or update user profile in Firestore
   */
  async updateUserProfile(
    user: User,
    additionalData: Partial<FirebaseUser> = {}
  ): Promise<void> {
    if (!user.uid) return;

    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const now = Timestamp.now();

    try {
      const userDoc = await getDoc(userRef);

      const userData: Partial<FirebaseUser> = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastLoginAt: now,
        ...additionalData,
      };

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: now,
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          ...userData,
          createdAt: now,
          updatedAt: now,
          isAdmin: additionalData.isAdmin || false,
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<FirebaseUser | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as FirebaseUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Create FirebaseUser object from Firebase User
   */
  private async createFirebaseUserObject(user: User): Promise<FirebaseUser> {
    const idTokenResult = await user.getIdTokenResult();
    const isAdmin = this.checkAdminClaims(idTokenResult) || ADMIN_EMAILS.includes(user.email || '');

    // Get user profile from Firestore for additional data
    const userProfile = await this.getUserProfile(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAdmin,
      createdAt: userProfile?.createdAt || Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    };
  }

  /**
   * Check if user has admin claims
   */
  private checkAdminClaims(idTokenResult: IdTokenResult): boolean {
    const claims = idTokenResult.claims as unknown as AdminClaims;
    return claims.admin === true || claims.role === 'admin';
  }

  /**
   * Convert Firebase Auth error to user-friendly message
   */
  private getAuthErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please check your email and password.';
      default:
        console.error('Auth error:', error);
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // ==========================================================================
  // ADMIN MANAGEMENT METHODS
  // ==========================================================================

  /**
   * Check if email is in admin list
   */
  isAdminEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email);
  }

  /**
   * Add email to admin list (for development/testing)
   */
  addAdminEmail(email: string): void {
    if (!ADMIN_EMAILS.includes(email)) {
      ADMIN_EMAILS.push(email);
    }
  }

  /**
   * Remove email from admin list (for development/testing)
   */
  removeAdminEmail(email: string): void {
    const index = ADMIN_EMAILS.indexOf(email);
    if (index > -1) {
      ADMIN_EMAILS.splice(index, 1);
    }
  }

  /**
   * Get all admin emails
   */
  getAdminEmails(): string[] {
    return [...ADMIN_EMAILS];
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const firebaseAuthService = new FirebaseAuthService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return firebaseAuthService.getCurrentUser() !== null;
};

/**
 * Get current user's UID
 */
export const getCurrentUserId = (): string | null => {
  return firebaseAuthService.getCurrentUser()?.uid || null;
};

/**
 * Wait for auth state to be determined
 */
export const waitForAuthState = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Check if current user has admin privileges
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  return firebaseAuthService.isCurrentUserAdmin();
};

// Export the auth instance for direct access if needed
export { auth };
