import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

// Define types for our context
interface User {
  token: string;
  user_id: string | null;
  profile_picture_url: string | null;
  cover_picture_url: string | null;
  username: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (firstname: string, lastname: string, email: string, password: string, passwordConfirmation: string) => Promise<any>;
  signIn: (username: string, password: string) => Promise<any>;
  signInGoogle: (credential: string) => Promise<any>;
  signInFacebook: (userData: any) => Promise<any>;
  signInApple: (accessToken: string, refreshToken?: string) => Promise<any>;
  logout: () => void;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (firstname: string, lastname: string, email: string, password: string, passwordConfirmation: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(firstname, lastname, email, password, passwordConfirmation);
      if (result.error) {
        setError(result.message);
        return result;
      }
      
      setCurrentUser({
        token: result.token,
        user_id: result.user_id.toString(),
        profile_picture_url: result.profile_picture_url || null,
        cover_picture_url: result.cover_picture_url || null,
        username: email // Use email as username initially
      });
      setIsAuthenticated(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration');
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in a user
  const signIn = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signIn(username, password);
      if (result.error) {
        setError(result.message);
        return result;
      }
      
      setCurrentUser({
        token: result.token,
        user_id: result.user_id.toString(),
        profile_picture_url: result.profile_picture_url || null,
        cover_picture_url: result.cover_picture_url || null,
        username
      });
      setIsAuthenticated(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in');
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInGoogle = async (credential: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInGoogle(credential);
      if (result.error) {
        setError(result.message);
        return result;
      }
      
      setCurrentUser({
        token: result.token,
        user_id: result.user_id.toString(),
        profile_picture_url: result.profile_picture_url || null,
        cover_picture_url: result.cover_picture_url || null,
        username: result.email || null
      });
      setIsAuthenticated(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Google sign in');
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Facebook
  const signInFacebook = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInFacebook(userData);
      if (result.error) {
        setError(result.message);
        return result;
      }
      
      setCurrentUser({
        token: result.token,
        user_id: result.user_id.toString(),
        profile_picture_url: result.profile_picture_url || null,
        cover_picture_url: result.cover_picture_url || null,
        username: result.email || null
      });
      setIsAuthenticated(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Facebook sign in');
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Apple
  const signInApple = async (accessToken: string, refreshToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInApple(accessToken, refreshToken);
      if (result.error) {
        setError(result.message);
        return result;
      }
      
      setCurrentUser({
        token: result.token,
        user_id: result.user_id.toString(),
        profile_picture_url: result.profile_picture_url || null,
        cover_picture_url: result.cover_picture_url || null,
        username: result.email || null
      });
      setIsAuthenticated(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Apple sign in');
      return { error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Create the context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    signIn,
    signInGoogle,
    signInFacebook,
    signInApple,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 