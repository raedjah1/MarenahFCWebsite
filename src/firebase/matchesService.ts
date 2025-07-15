// Firestore service for matches management
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./config";
import type {
  Match,
  MatchInput,
  MatchType,
  MatchStatus,
  MatchResult,
  MatchEvent,
  Substitution,
  QueryResult,
  PaginationParams,
  ValidationError,
} from "./types";

// ============================================================================
// CONSTANTS
// ============================================================================

const MATCHES_COLLECTION = "matches";
const MATCH_MEDIA_STORAGE_PATH = "match-media";

// ============================================================================
// INTERFACES
// ============================================================================

export interface MatchQueryOptions extends PaginationParams {
  status?: MatchStatus;
  matchType?: MatchType;
  isHome?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  opponent?: string;
  competition?: string;
}

export interface MatchServiceResult {
  success: boolean;
  data?: Match;
  error?: string;
}

export interface MatchesResult {
  success: boolean;
  data?: QueryResult<Match>;
  error?: string;
}

export interface UpcomingMatchesFilter {
  limit?: number;
  includeToday?: boolean;
}

export interface PastMatchesFilter {
  limit?: number;
  includeToday?: boolean;
}

// ============================================================================
// MATCHES SERVICE CLASS
// ============================================================================

class MatchesService {
  private collection = collection(db, MATCHES_COLLECTION);

  // ==========================================================================
  // CREATE OPERATIONS
  // ==========================================================================

  /**
   * Create a new match
   */
  async createMatch(input: MatchInput, logoFile?: File): Promise<MatchServiceResult> {
    try {
      // Validate input
      const validationErrors = this.validateMatchInput(input);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation errors: ${validationErrors.map((e) => e.message).join(", ")}`,
        };
      }

      let opponentLogo = input.opponentLogo;

      // Upload logo if provided
      if (logoFile) {
        const logoUploadResult = await this.uploadOpponentLogo(logoFile);
        if (logoUploadResult.success) {
          opponentLogo = logoUploadResult.url;
        } else {
          return {
            success: false,
            error: logoUploadResult.error || "Failed to upload opponent logo",
          };
        }
      }

      const now = Timestamp.now();
      const matchDate = Timestamp.fromDate(input.date);

      // Determine match status based on date
      const status = this.determineMatchStatus(input.date, input.result);

      const matchData: Omit<Match, "id"> = {
        date: matchDate,
        opponent: input.opponent.trim(),
        location: input.location.trim(),
        isHome: input.isHome,
        matchType: input.matchType,
        status,
        lineup: [],
        substitutions: [],
        events: [],
        createdAt: now,
        updatedAt: now,
      };
      
      // Add opponent logo if available
      if (opponentLogo) {
        matchData.opponentLogo = opponentLogo;
      }

      // Only add fields that have values to avoid undefined
      if (input.opponentLogo) {
        matchData.opponentLogo = input.opponentLogo;
      }
      if (input.competition?.trim()) {
        matchData.competition = input.competition.trim();
      }
      if (input.result) {
        matchData.result = input.result;
      }
      if (input.referee?.trim()) {
        matchData.referee = input.referee.trim();
      }
      if (input.attendance) {
        matchData.attendance = input.attendance;
      }
      if (input.weatherConditions?.trim()) {
        matchData.weatherConditions = input.weatherConditions.trim();
      }
      if (input.ticketPrice) {
        matchData.ticketPrice = input.ticketPrice;
      }
      if (input.ticketURL?.trim()) {
        matchData.ticketURL = input.ticketURL.trim();
      }
      if (input.liveStreamURL?.trim()) {
        matchData.liveStreamURL = input.liveStreamURL.trim();
      }
      if (input.notes?.trim()) {
        matchData.notes = input.notes.trim();
      }

      const docRef = await addDoc(this.collection, matchData);
      const match: Match = {
        id: docRef.id,
        ...matchData,
      };

      return {
        success: true,
        data: match,
      };
    } catch (error) {
      console.error("Error creating match:", error);
      return {
        success: false,
        error: "Failed to create match. Please try again.",
      };
    }
  }

  /**
   * Bulk create matches
   */
  async createMatches(inputs: MatchInput[]): Promise<MatchesResult> {
    try {
      const batch = writeBatch(db);
      const matches: Match[] = [];
      const now = Timestamp.now();

      for (const input of inputs) {
        // Validate each input
        const validationErrors = this.validateMatchInput(input);
        if (validationErrors.length > 0) {
          return {
            success: false,
            error: `Validation errors for match vs ${input.opponent}: ${validationErrors.map((e) => e.message).join(", ")}`,
          };
        }

        const docRef = doc(this.collection);
        const matchDate = Timestamp.fromDate(input.date);
        const status = this.determineMatchStatus(input.date, input.result);

        const matchData: Omit<Match, "id"> = {
          date: matchDate,
          opponent: input.opponent.trim(),
          location: input.location.trim(),
          isHome: input.isHome,
          matchType: input.matchType,
          status,
          lineup: [],
          substitutions: [],
          events: [],
          createdAt: now,
          updatedAt: now,
        };

        // Only add fields that have values to avoid undefined
        if (input.opponentLogo) {
          matchData.opponentLogo = input.opponentLogo;
        }
        if (input.competition?.trim()) {
          matchData.competition = input.competition.trim();
        }
        if (input.result) {
          matchData.result = input.result;
        }
        if (input.referee?.trim()) {
          matchData.referee = input.referee.trim();
        }
        if (input.attendance) {
          matchData.attendance = input.attendance;
        }
        if (input.weatherConditions?.trim()) {
          matchData.weatherConditions = input.weatherConditions.trim();
        }
        if (input.ticketPrice) {
          matchData.ticketPrice = input.ticketPrice;
        }
        if (input.ticketURL?.trim()) {
          matchData.ticketURL = input.ticketURL.trim();
        }
        if (input.liveStreamURL?.trim()) {
          matchData.liveStreamURL = input.liveStreamURL.trim();
        }
        if (input.notes?.trim()) {
          matchData.notes = input.notes.trim();
        }

        batch.set(docRef, matchData);
        matches.push({
          id: docRef.id,
          ...matchData,
        });
      }

      await batch.commit();

      return {
        success: true,
        data: {
          data: matches,
          hasMore: false,
          total: matches.length,
        },
      };
    } catch (error) {
      console.error("Error creating matches:", error);
      return {
        success: false,
        error: "Failed to create matches. Please try again.",
      };
    }
  }

  // ==========================================================================
  // READ OPERATIONS
  // ==========================================================================

  /**
   * Get all matches with optional filtering and pagination
   */
  async getMatches(options: MatchQueryOptions = {}): Promise<MatchesResult> {
    try {
      let q = query(this.collection);

      // Apply filters
      if (options.status) {
        q = query(q, where("status", "==", options.status));
      }

      if (options.matchType) {
        q = query(q, where("matchType", "==", options.matchType));
      }

      if (options.isHome !== undefined) {
        q = query(q, where("isHome", "==", options.isHome));
      }

      if (options.competition) {
        q = query(q, where("competition", "==", options.competition));
      }

      if (options.opponent) {
        q = query(q, where("opponent", "==", options.opponent));
      }

      // Apply date range filter
      if (options.dateRange) {
        const startTimestamp = Timestamp.fromDate(options.dateRange.start);
        const endTimestamp = Timestamp.fromDate(options.dateRange.end);
        q = query(
          q,
          where("date", ">=", startTimestamp),
          where("date", "<=", endTimestamp),
        );
      }

      // Apply ordering
      const orderField = options.orderBy || "date";
      const orderDirection = options.orderDirection || "desc";
      q = query(q, orderBy(orderField, orderDirection));

      // Apply pagination
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      const matches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Match[];

      return {
        success: true,
        data: {
          data: matches,
          hasMore: snapshot.docs.length === (options.limit || 0),
          total: matches.length,
          lastDoc: snapshot.docs[snapshot.docs.length - 1],
        },
      };
    } catch (error) {
      console.error("Error getting matches:", error);
      return {
        success: false,
        error: "Failed to fetch matches. Please try again.",
      };
    }
  }

  /**
   * Get match by ID
   */
  async getMatchById(id: string): Promise<MatchServiceResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const match: Match = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Match;

        return {
          success: true,
          data: match,
        };
      } else {
        return {
          success: false,
          error: "Match not found.",
        };
      }
    } catch (error) {
      console.error("Error getting match:", error);
      return {
        success: false,
        error: "Failed to fetch match. Please try again.",
      };
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(
    filter: UpcomingMatchesFilter = {},
  ): Promise<MatchesResult> {
    try {
      const now = new Date();
      if (!filter.includeToday) {
        now.setHours(23, 59, 59, 999); // End of today
      }

      return this.getMatches({
        dateRange: {
          start: now,
          end: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // One year from now
        },
        orderBy: "date",
        orderDirection: "asc",
        limit: filter.limit || 10,
      });
    } catch (error) {
      console.error("Error getting upcoming matches:", error);
      return {
        success: false,
        error: "Failed to fetch upcoming matches. Please try again.",
      };
    }
  }

  /**
   * Get next match
   */
  async getNextMatch(): Promise<MatchServiceResult> {
    const upcomingResult = await this.getUpcomingMatches({ limit: 1 });

    if (
      upcomingResult.success &&
      upcomingResult.data &&
      upcomingResult.data.data.length > 0
    ) {
      return {
        success: true,
        data: upcomingResult.data.data[0],
      };
    }

    return {
      success: false,
      error: "No upcoming matches found.",
    };
  }

  /**
   * Get past matches
   */
  async getPastMatches(filter: PastMatchesFilter = {}): Promise<MatchesResult> {
    try {
      const now = new Date();
      if (!filter.includeToday) {
        now.setHours(0, 0, 0, 0); // Start of today
      }

      return this.getMatches({
        dateRange: {
          start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // One year ago
          end: now,
        },
        orderBy: "date",
        orderDirection: "desc",
        limit: filter.limit || 10,
      });
    } catch (error) {
      console.error("Error getting past matches:", error);
      return {
        success: false,
        error: "Failed to fetch past matches. Please try again.",
      };
    }
  }

  /**
   * Get latest match result
   */
  async getLatestResult(): Promise<MatchServiceResult> {
    const pastResult = await this.getPastMatches({ limit: 1 });

    if (
      pastResult.success &&
      pastResult.data &&
      pastResult.data.data.length > 0
    ) {
      const match = pastResult.data.data[0];
      if (match.result) {
        return {
          success: true,
          data: match,
        };
      }
    }

    return {
      success: false,
      error: "No recent results found.",
    };
  }

  // ==========================================================================
  // UPDATE OPERATIONS
  // ==========================================================================

  /**
   * Update match
   */
  async updateMatch(
    id: string,
    input: Partial<MatchInput>,
    logoFile?: File
  ): Promise<MatchServiceResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: "Match not found.",
        };
      }
      
      const currentData = docSnap.data() as Match;
      let opponentLogo = input.opponentLogo;
      
      // Upload new logo if provided
      if (logoFile) {
        // Delete old logo if it exists
        if (currentData.opponentLogo) {
          await this.deleteOpponentLogo(currentData.opponentLogo);
        }
        
        const logoUploadResult = await this.uploadOpponentLogo(logoFile);
        if (logoUploadResult.success) {
          opponentLogo = logoUploadResult.url;
        } else {
          return {
            success: false,
            error: logoUploadResult.error || "Failed to upload opponent logo",
          };
        }
      }

      const updateData: Partial<Match> = {
        ...input,
        date: input.date ? Timestamp.fromDate(input.date) : undefined,
        updatedAt: Timestamp.now(),
      };
      
      // Add opponent logo if available
      if (opponentLogo) {
        updateData.opponentLogo = opponentLogo;
      }

      // Update status if date or result changed
      if (input.date || input.result !== undefined) {
        const currentData = docSnap.data() as Match;
        const newDate = input.date || currentData.date.toDate();
        const newResult =
          input.result !== undefined ? input.result : currentData.result;
        updateData.status = this.determineMatchStatus(newDate, newResult);
      }

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof Match] === undefined) {
          delete updateData[key as keyof Match];
        }
      });

      await updateDoc(docRef, updateData);

      // Get updated document
      const updatedDocSnap = await getDoc(docRef);
      const updatedMatch: Match = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as Match;

      return {
        success: true,
        data: updatedMatch,
      };
    } catch (error) {
      console.error("Error updating match:", error);
      return {
        success: false,
        error: "Failed to update match. Please try again.",
      };
    }
  }

  /**
   * Update match result
   */
  async updateMatchResult(
    id: string,
    result: MatchResult,
  ): Promise<MatchServiceResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: "Match not found.",
        };
      }

      const currentData = docSnap.data() as Match;
      const newStatus = this.determineMatchStatus(
        currentData.date.toDate(),
        result,
      );

      await updateDoc(docRef, {
        result,
        status: newStatus,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedMatch: Match = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as Match;

      return {
        success: true,
        data: updatedMatch,
      };
    } catch (error) {
      console.error("Error updating match result:", error);
      return {
        success: false,
        error: "Failed to update match result. Please try again.",
      };
    }
  }

  /**
   * Update match status
   */
  async updateMatchStatus(
    id: string,
    status: MatchStatus,
  ): Promise<MatchServiceResult> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedMatch: Match = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as Match;

      return {
        success: true,
        data: updatedMatch,
      };
    } catch (error) {
      console.error("Error updating match status:", error);
      return {
        success: false,
        error: "Failed to update match status. Please try again.",
      };
    }
  }

  /**
   * Add match event
   */
  async addMatchEvent(
    id: string,
    event: MatchEvent,
  ): Promise<MatchServiceResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: "Match not found.",
        };
      }

      const currentData = docSnap.data() as Match;
      const events = [...(currentData.events || []), event];

      // Sort events by minute
      events.sort((a, b) => a.minute - b.minute);

      await updateDoc(docRef, {
        events,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedMatch: Match = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as Match;

      return {
        success: true,
        data: updatedMatch,
      };
    } catch (error) {
      console.error("Error adding match event:", error);
      return {
        success: false,
        error: "Failed to add match event. Please try again.",
      };
    }
  }

  // ==========================================================================
  // DELETE OPERATIONS
  // ==========================================================================

  /**
   * Delete match
   */
  async deleteMatch(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting match:", error);
      return {
        success: false,
        error: "Failed to delete match. Please try again.",
      };
    }
  }

  // ==========================================================================
  // REAL-TIME LISTENERS
  // ==========================================================================

  /**
   * Subscribe to matches changes
   */
  subscribeToMatches(
    callback: (matches: Match[]) => void,
    options: MatchQueryOptions = {},
  ): () => void {
    let q = query(this.collection);

    // Apply filters
    if (options.status) {
      q = query(q, where("status", "==", options.status));
    }

    if (options.matchType) {
      q = query(q, where("matchType", "==", options.matchType));
    }

    if (options.isHome !== undefined) {
      q = query(q, where("isHome", "==", options.isHome));
    }

    // Apply ordering
    const orderField = options.orderBy || "date";
    const orderDirection = options.orderDirection || "desc";
    q = query(q, orderBy(orderField, orderDirection));

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Match[];

      callback(matches);
    });
  }

  /**
   * Subscribe to single match changes
   */
  subscribeToMatch(
    id: string,
    callback: (match: Match | null) => void,
  ): () => void {
    const docRef = doc(this.collection, id);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const match: Match = {
          id: doc.id,
          ...doc.data(),
        } as Match;
        callback(match);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Subscribe to upcoming matches
   */
  subscribeToUpcomingMatches(callback: (matches: Match[]) => void): () => void {
    const now = Timestamp.now();

    const q = query(
      this.collection,
      where("date", ">=", now),
      orderBy("date", "asc"),
      limit(5),
    );

    return onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Match[];

      callback(matches);
    });
  }

  // ==========================================================================
  // STATISTICS AND ANALYTICS
  // ==========================================================================

  /**
   * Get season statistics
   */
  async getSeasonStats(season?: string): Promise<{
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  }> {
    try {
      const pastMatches = await this.getPastMatches({ limit: 100 });

      if (!pastMatches.success || !pastMatches.data) {
        return {
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }

      const matches = pastMatches.data.data.filter((match) => match.result);

      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      matches.forEach((match) => {
        if (!match.result) return;

        const { homeScore, awayScore } = match.result;
        const ourScore = match.isHome ? homeScore : awayScore;
        const theirScore = match.isHome ? awayScore : homeScore;

        goalsFor += ourScore;
        goalsAgainst += theirScore;

        if (ourScore > theirScore) {
          wins++;
        } else if (ourScore === theirScore) {
          draws++;
        } else {
          losses++;
        }
      });

      return {
        gamesPlayed: matches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
      };
    } catch (error) {
      console.error("Error getting season stats:", error);
      return {
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }
  }

  // ==========================================================================
  // FILE UPLOAD OPERATIONS
  // ==========================================================================

  /**
   * Upload opponent logo
   */
  private async uploadOpponentLogo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${MATCH_MEDIA_STORAGE_PATH}/logos/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        url: downloadURL,
      };
    } catch (error) {
      console.error('Error uploading opponent logo:', error);
      return {
        success: false,
        error: 'Failed to upload opponent logo. Please try again.',
      };
    }
  }

  /**
   * Delete opponent logo
   */
  private async deleteOpponentLogo(logoURL: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(logoURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      // Don't throw error for logo deletion failures
      console.warn('Failed to delete opponent logo:', error);
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Determine match status based on date and result
   */
  private determineMatchStatus(date: Date, result?: MatchResult): MatchStatus {
    const now = new Date();
    const matchDate = new Date(date);

    if (result) {
      return "finished";
    }

    if (matchDate < now) {
      return "finished"; // Past match without result
    }

    return "scheduled";
  }

  /**
   * Validate match input
   */
  private validateMatchInput(input: MatchInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!input.opponent || input.opponent.trim().length === 0) {
      errors.push({ field: "opponent", message: "Opponent is required" });
    }

    if (!input.location || input.location.trim().length === 0) {
      errors.push({ field: "location", message: "Location is required" });
    }

    if (!input.date) {
      errors.push({ field: "date", message: "Date is required" });
    }

    if (!input.matchType) {
      errors.push({ field: "matchType", message: "Match type is required" });
    }

    // Validate result if provided
    if (input.result) {
      if (input.result.homeScore < 0 || input.result.awayScore < 0) {
        errors.push({ field: "result", message: "Scores cannot be negative" });
      }
    }

    // Validate ticket price
    if (input.ticketPrice && input.ticketPrice < 0) {
      errors.push({
        field: "ticketPrice",
        message: "Ticket price cannot be negative",
      });
    }

    // Validate attendance
    if (input.attendance && input.attendance < 0) {
      errors.push({
        field: "attendance",
        message: "Attendance cannot be negative",
      });
    }

    return errors;
  }

  /**
   * Get match collection reference
   */
  getCollectionRef() {
    return this.collection;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const matchesService = new MatchesService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format match score for display
 */
export const formatMatchScore = (match: Match): string => {
  if (!match.result) return "vs";

  const { homeScore, awayScore } = match.result;
  return match.isHome
    ? `${homeScore}-${awayScore}`
    : `${awayScore}-${homeScore}`;
};

/**
 * Get match result type (win/draw/loss)
 */
export const getMatchResultType = (
  match: Match,
): "win" | "draw" | "loss" | null => {
  if (!match.result) return null;

  const { homeScore, awayScore } = match.result;
  const ourScore = match.isHome ? homeScore : awayScore;
  const theirScore = match.isHome ? awayScore : homeScore;

  if (ourScore > theirScore) return "win";
  if (ourScore === theirScore) return "draw";
  return "loss";
};

/**
 * Format match date for display
 */
export const formatMatchDate = (
  date: Timestamp,
  includeTime = true,
): string => {
  const jsDate = date.toDate();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return jsDate.toLocaleDateString("en-US", options);
};

/**
 * Check if match is today
 */
export const isMatchToday = (date: Timestamp): boolean => {
  const matchDate = date.toDate();
  const today = new Date();

  return matchDate.toDateString() === today.toDateString();
};

/**
 * Check if match is live (within 2 hours of start time)
 */
export const isMatchLive = (match: Match): boolean => {
  if (match.status === "live") return true;

  const matchDate = match.date.toDate();
  const now = new Date();
  const timeDiff = Math.abs(now.getTime() - matchDate.getTime());
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff <= 2 && match.status === "scheduled";
};

/**
 * Get match status display name
 */
export const getMatchStatusDisplayName = (status: MatchStatus): string => {
  const statusNames: Record<MatchStatus, string> = {
    scheduled: "Scheduled",
    live: "Live",
    finished: "Finished",
    postponed: "Postponed",
    cancelled: "Cancelled",
  };
  return statusNames[status];
};

/**
 * Get match type display name
 */
export const getMatchTypeDisplayName = (type: MatchType): string => {
  const typeNames: Record<MatchType, string> = {
    league: "League",
    cup: "Cup",
    friendly: "Friendly",
    playoff: "Playoff",
  };
  return typeNames[type];
};
