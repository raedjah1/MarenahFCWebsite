// Firebase-based Authentication Context
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User } from 'firebase/auth';
import { firebaseAuthService, type AuthResult, type AuthState } from '../firebase/auth';
import type { FirebaseUser } from '../firebase/types';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface FirebaseAuthContextType {
  // State
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;

  // Utilities
  checkAdminStatus: () => Promise<boolean>;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Computed state
  const isAuthenticated = user !== null;

  // ========================================================================
  // AUTH ACTIONS
  // ========================================================================

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuthService.signInWithEmail(email, password);

      if (result.success && result.user) {
        setUser(result.user);
        setIsAdmin(result.user.isAdmin);
      } else {
        setError(result.error || 'Sign in failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    const currentUser = firebaseAuthService.getCurrentUser();

    if (currentUser) {
      setLoading(true);
      try {
        // Force token refresh to get latest claims
        await currentUser.getIdToken(true);

        // Check admin status
        const adminStatus = await firebaseAuthService.isCurrentUserAdmin();

        if (!adminStatus) {
          // User is no longer admin, sign them out
          await signOut();
          setError('Admin privileges have been revoked. Please contact an administrator.');
          return;
        }

        // Update user profile
        await firebaseAuthService.updateUserProfile(currentUser, { isAdmin: adminStatus });

        // Get updated user profile
        const userProfile = await firebaseAuthService.getUserProfile(currentUser.uid);
        if (userProfile) {
          setUser(userProfile);
          setIsAdmin(userProfile.isAdmin);
        }
      } catch (err) {
        console.error('Error refreshing user:', err);
        setError('Failed to refresh user data');
      } finally {
        setLoading(false);
      }
    }
  }, [signOut]);

  /**
   * Check current user's admin status
   */
  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      const adminStatus = await firebaseAuthService.isCurrentUserAdmin();
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  }, []);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Set up auth state listener
   */
  useEffect(() => {
    setLoading(true);

    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          setIsAdmin(firebaseUser.isAdmin);

          // Double-check admin status
          const adminStatus = await firebaseAuthService.isCurrentUserAdmin();

          if (!adminStatus) {
            // User is not admin, sign them out
            await firebaseAuthService.signOut();
            setUser(null);
            setIsAdmin(false);
            setError('Access denied. Admin privileges required.');
          } else {
            setIsAdmin(true);
          }
        } else {
          // User is signed out
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Authentication error occurred');
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Periodically refresh user data and check admin status
   */
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const currentUser = firebaseAuthService.getCurrentUser();
        if (currentUser) {
          const adminStatus = await firebaseAuthService.isCurrentUserAdmin();

          if (!adminStatus) {
            // User is no longer admin, sign them out
            await signOut();
            setError('Admin privileges have been revoked. Please contact an administrator.');
          }
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user, signOut]);

  /**
   * Clear errors after 10 seconds
   */
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const contextValue: FirebaseAuthContextType = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,

    // Actions
    signIn,
    signOut,
    clearError,
    refreshUser,

    // Utilities
    checkAdminStatus,
  };

  return (
    <FirebaseAuthContext.Provider value={contextValue}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook to use Firebase auth context
 */
export const useFirebaseAuth = (): FirebaseAuthContextType => {
  const context = useContext(FirebaseAuthContext);

  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }

  return context;
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to require authentication
 */
export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useFirebaseAuth();

  return {
    isAuthenticated,
    loading,
    canAccess: isAuthenticated && !loading,
  };
};

/**
 * Hook to require admin privileges
 */
export const useRequireAdmin = () => {
  const { isAuthenticated, isAdmin, loading } = useFirebaseAuth();

  return {
    isAuthenticated,
    isAdmin,
    loading,
    canAccess: isAuthenticated && isAdmin && !loading,
  };
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  const { user, loading, isAuthenticated } = useFirebaseAuth();

  return {
    user,
    loading,
    isAuthenticated,
  };
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default FirebaseAuthContext;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { FirebaseAuthContextType };
