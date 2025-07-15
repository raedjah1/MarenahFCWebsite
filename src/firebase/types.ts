// TypeScript types for Firebase data models
import { Timestamp } from 'firebase/firestore';

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface AdminClaims {
  admin: boolean;
  role: 'admin' | 'editor' | 'viewer';
}

// ============================================================================
// TEAM MEMBER TYPES
// ============================================================================

export type TeamMemberRole = 'management' | 'coach' | 'player' | 'staff';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  title?: string; // e.g., "Head Coach", "Captain", "Manager"
  position?: string; // For players: "Forward", "Midfielder", etc.
  jerseyNumber?: number; // For players
  photoURL?: string;
  bio?: string;
  dateOfBirth?: Timestamp;
  nationality?: string;
  height?: number; // in cm
  weight?: number; // in kg
  joinedDate?: Timestamp;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  stats?: PlayerStats; // Only for players
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PlayerStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

// Input type for creating/updating team members
export interface TeamMemberInput {
  name: string;
  role: TeamMemberRole;
  title?: string;
  position?: string;
  jerseyNumber?: number;
  photoURL?: string;
  bio?: string;
  dateOfBirth?: Date;
  nationality?: string;
  height?: number;
  weight?: number;
  joinedDate?: Date;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  isActive?: boolean;
}

// ============================================================================
// MATCH TYPES
// ============================================================================

export type MatchType = 'league' | 'cup' | 'friendly' | 'playoff';
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';

export interface Match {
  id: string;
  date: Timestamp;
  opponent: string;
  opponentLogo?: string;
  location: string;
  isHome: boolean; // true for home games, false for away
  competition?: string; // e.g., "Premier League", "FA Cup"
  matchType: MatchType;
  status: MatchStatus;
  result?: MatchResult;
  lineup?: string[]; // Array of player IDs
  substitutions?: Substitution[];
  events?: MatchEvent[];
  referee?: string;
  attendance?: number;
  weatherConditions?: string;
  ticketPrice?: number;
  ticketURL?: string;
  liveStreamURL?: string;
  highlightsURL?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  penaltyShootout?: {
    homeScore: number;
    awayScore: number;
  };
  extraTime?: boolean;
}

export interface Substitution {
  minute: number;
  playerOut: string; // Player ID
  playerIn: string; // Player ID
  reason?: 'tactical' | 'injury' | 'disciplinary';
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  playerId: string;
  description?: string;
  assistId?: string; // For goals
}

// Input type for creating/updating matches
export interface MatchInput {
  date: Date;
  opponent: string;
  opponentLogo?: string;
  location: string;
  isHome: boolean;
  competition?: string;
  matchType: MatchType;
  result?: {
    homeScore: number;
    awayScore: number;
    penaltyShootout?: {
      homeScore: number;
      awayScore: number;
    };
    extraTime?: boolean;
  };
  referee?: string;
  attendance?: number;
  weatherConditions?: string;
  ticketPrice?: number;
  ticketURL?: string;
  liveStreamURL?: string;
  notes?: string;
}

// ============================================================================
// PRODUCT/STORE TYPES
// ============================================================================

export type ProductCategory = 'jerseys' | 'training' | 'accessories' | 'lifestyle' | 'equipment';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // e.g., "USD", "EUR"
  category: ProductCategory;
  imageURLs: string[]; // Multiple product images
  sizes: Record<ProductSize, number>; // Size -> stock count mapping
  colors?: string[];
  material?: string;
  careInstructions?: string;
  sku: string; // Stock Keeping Unit
  brand?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  specifications?: Record<string, string>; // Key-value pairs for product specs
  discount?: {
    percentage: number;
    validUntil: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Input type for creating/updating products
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  currency?: string;
  category: ProductCategory;
  imageURLs: string[];
  sizes: Record<ProductSize, number>;
  colors?: string[];
  material?: string;
  careInstructions?: string;
  sku: string;
  brand?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  specifications?: Record<string, string>;
  discount?: {
    percentage: number;
    validUntil: Date;
  };
}

// ============================================================================
// SHOPPING CART TYPES
// ============================================================================

export interface CartItem {
  productId: string;
  product: Product;
  size: ProductSize;
  color?: string;
  quantity: number;
  addedAt: Timestamp;
}

export interface ShoppingCart {
  id: string;
  userId?: string; // Optional for guest carts
  items: CartItem[];
  totalAmount: number;
  currency: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId?: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// BLOG/NEWS TYPES
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// ANALYTICS/STATISTICS TYPES
// ============================================================================

export interface SeasonStats {
  id: string;
  season: string; // e.g., "2023-24"
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position?: number; // League position
  topScorer?: {
    playerId: string;
    goals: number;
  };
  topAssister?: {
    playerId: string;
    assists: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionURL?: string;
  createdAt: Timestamp;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FirestoreTimestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryResult<T> {
  data: T[];
  hasMore: boolean;
  total?: number;
  lastDoc?: any; // Firestore DocumentSnapshot for pagination
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface FirebaseError {
  code: string;
  message: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
