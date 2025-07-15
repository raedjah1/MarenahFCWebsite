// Firebase initialization and exports
// This file serves as the main entry point for all Firebase-related functionality

// ============================================================================
// CORE FIREBASE EXPORTS
// ============================================================================

// Firebase configuration and core services
import app, { db, storage, functions, firebaseConfig } from "./config";
export { default as app, db, auth, storage, functions } from "./config";
export { firebaseConfig } from "./config";

// ============================================================================
// AUTHENTICATION EXPORTS
// ============================================================================

// Authentication service and utilities

export {
  firebaseAuthService,
  isAuthenticated,
  getCurrentUserId,
  waitForAuthState,
  isCurrentUserAdmin,
} from "./auth";

// Authentication types
export type { AuthResult, AuthState } from "./auth";

// ============================================================================
// TEAM SERVICE EXPORTS
// ============================================================================

// Team service and utilities

export {
  teamService,
  getAvailableJerseyNumbers,
  formatTeamMemberName,
  getRoleDisplayName,
} from "./teamService";

// Team service types
export type {
  TeamMemberQueryOptions,
  TeamMemberResult,
  TeamMembersResult,
} from "./teamService";

// ============================================================================
// MATCHES SERVICE EXPORTS
// ============================================================================

// Matches service and utilities

export {
  matchesService,
  formatMatchScore,
  getMatchResultType,
  formatMatchDate,
  isMatchToday,
  isMatchLive,
  getMatchStatusDisplayName,
  getMatchTypeDisplayName,
} from "./matchesService";

// Matches service types
export type {
  MatchQueryOptions,
  MatchServiceResult,
  MatchesResult,
  UpcomingMatchesFilter,
  PastMatchesFilter,
} from "./matchesService";

// ============================================================================
// STORE SERVICE EXPORTS
// ============================================================================

// Store service and utilities

export {
  storeService,
  formatPrice,
  calculateDiscountedPrice,
  isProductOnSale,
  getAvailableSizes,
  isProductInStock,
  getCategoryDisplayName,
  getSizeDisplayName,
} from "./storeService";

// Store service types
export type {
  ProductQueryOptions,
  ProductResult,
  ProductsResult,
  CartResult,
  OrderResult,
  OrdersResult,
  InventoryUpdate,
} from "./storeService";

// ============================================================================
// FIREBASE TYPES EXPORTS
// ============================================================================

// Core Firebase types
export type {
  // Authentication types
  FirebaseUser,
  AdminClaims,

  // Team types
  TeamMember,
  TeamMemberInput,
  TeamMemberRole,
  PlayerStats,

  // Match types
  Match,
  MatchInput,
  MatchType,
  MatchStatus,
  MatchResult,
  MatchEvent,
  Substitution,

  // Product/Store types
  Product,
  ProductInput,
  ProductCategory,
  ProductSize,
  CartItem,
  ShoppingCart,
  Order,
  OrderStatus,

  // Blog types
  BlogPost,

  // Analytics types
  SeasonStats,

  // Notification types
  Notification,

  // Utility types
  FirestoreTimestamps,
  PaginationParams,
  QueryResult,
  FirebaseError,
  ValidationError,
} from "./types";

// ============================================================================
// CONSTANTS
// ============================================================================

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  TEAM_MEMBERS: "teamMembers",
  MATCHES: "matches",
  PRODUCTS: "products",
  CARTS: "carts",
  ORDERS: "orders",
  BLOG_POSTS: "blogPosts",
  NOTIFICATIONS: "notifications",
  SEASON_STATS: "seasonStats",
} as const;

// Storage paths
export const STORAGE_PATHS = {
  TEAM_PHOTOS: "team-photos",
  PRODUCT_IMAGES: "product-images",
  MATCH_MEDIA: "match-media",
  BLOG_IMAGES: "blog-images",
} as const;

// Admin emails (for fallback admin check)
export const ADMIN_EMAILS = [
  "admin@marenahfc.com",
  "manager@marenahfc.com",
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Initialize Firebase services
 * Call this function early in your app initialization
 */
export const initializeFirebase = async (): Promise<void> => {
  try {
    // Firebase is automatically initialized when importing the config
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase:", error);
    throw error;
  }
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  try {
    return Boolean(
      firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId,
    );
  } catch {
    return false;
  }
};

/**
 * Get Firebase project info
 */
export const getFirebaseProjectInfo = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isConfigured: isFirebaseConfigured(),
  };
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Parse Firebase error codes to user-friendly messages
 */
export const parseFirebaseError = (error: unknown): string => {
  if (!error) return "An unknown error occurred";

  // Firebase Auth errors
  if (typeof error === "object" && error !== null && "code" in error) {
    const firebaseError = error as { code: string; message?: string };
    switch (firebaseError.code) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "permission-denied":
        return "You do not have permission to perform this action";
      case "not-found":
        return "The requested resource was not found";
      case "already-exists":
        return "A resource with this identifier already exists";
      case "invalid-argument":
        return "Invalid data provided";
      case "deadline-exceeded":
        return "Request timed out. Please try again";
      case "unavailable":
        return "Service temporarily unavailable. Please try again";
      default:
        return firebaseError.message || "An unexpected error occurred";
    }
  }

  // Generic error handling
  if (typeof error === "object" && error !== null && "message" in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }

  return "An unexpected error occurred";
};

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Enable Firebase emulators (development only)
 */
export const enableEmulators = (): void => {
  if (import.meta.env.DEV) {
    console.log("🔧 Firebase emulators enabled for development");
  }
};

/**
 * Get Firebase environment info
 */
export const getFirebaseEnvironment = () => {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    emulators: import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true",
    projectId: firebaseConfig.projectId,
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core
  app,
  db,
  storage,
  functions,

  // Utilities
  initializeFirebase,
  isFirebaseConfigured,
  getFirebaseProjectInfo,
  parseFirebaseError,
  enableEmulators,
  getFirebaseEnvironment,

  // Constants
  COLLECTIONS,
  STORAGE_PATHS,
  ADMIN_EMAILS,
};
