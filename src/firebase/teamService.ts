// Firestore service for team members management
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
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import type {
  TeamMember,
  TeamMemberInput,
  TeamMemberRole,
  PlayerStats,
  QueryResult,
  PaginationParams,
  ValidationError,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const TEAM_MEMBERS_COLLECTION = 'teamMembers';
const PLAYER_STATS_COLLECTION = 'playerStats';
const STORAGE_PATH = 'team-photos';

// ============================================================================
// INTERFACES
// ============================================================================

export interface TeamMemberQueryOptions extends PaginationParams {
  role?: TeamMemberRole;
  isActive?: boolean;
  searchTerm?: string;
}

export interface TeamMemberResult {
  success: boolean;
  data?: TeamMember;
  error?: string;
}

export interface TeamMembersResult {
  success: boolean;
  data?: QueryResult<TeamMember>;
  error?: string;
}

// ============================================================================
// TEAM SERVICE CLASS
// ============================================================================

class TeamService {
  private collection = collection(db, TEAM_MEMBERS_COLLECTION);

  // ==========================================================================
  // CREATE OPERATIONS
  // ==========================================================================

  /**
   * Create a new team member
   */
  async createTeamMember(input: TeamMemberInput, photoFile?: File): Promise<TeamMemberResult> {
    try {
      // Validate input
      const validationErrors = this.validateTeamMemberInput(input);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation errors: ${validationErrors.map(e => e.message).join(', ')}`,
        };
      }

      // Check for duplicate jersey number if provided
      if (input.jerseyNumber && input.role === 'player') {
        const duplicate = await this.getTeamMemberByJerseyNumber(input.jerseyNumber);
        if (duplicate) {
          return {
            success: false,
            error: `Jersey number ${input.jerseyNumber} is already taken.`,
          };
        }
      }

      let photoURL = input.photoURL;

      // Upload photo if provided
      if (photoFile) {
        const photoUploadResult = await this.uploadTeamMemberPhoto(photoFile);
        if (photoUploadResult.success) {
          photoURL = photoUploadResult.url;
        }
      }

      const now = Timestamp.now();
      const teamMemberData: Omit<TeamMember, 'id'> = {
        name: input.name.trim(),
        role: input.role,
        isActive: input.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };

      // Only add fields that have values to avoid undefined
      if (input.title?.trim()) {
        teamMemberData.title = input.title.trim();
      }
      if (input.position?.trim()) {
        teamMemberData.position = input.position.trim();
      }
      if (input.jerseyNumber) {
        teamMemberData.jerseyNumber = input.jerseyNumber;
      }
      if (photoURL) {
        teamMemberData.photoURL = photoURL;
      }
      if (input.bio?.trim()) {
        teamMemberData.bio = input.bio.trim();
      }
      if (input.dateOfBirth) {
        teamMemberData.dateOfBirth = Timestamp.fromDate(input.dateOfBirth);
      }
      if (input.nationality?.trim()) {
        teamMemberData.nationality = input.nationality.trim();
      }
      if (input.height) {
        teamMemberData.height = input.height;
      }
      if (input.weight) {
        teamMemberData.weight = input.weight;
      }
      if (input.joinedDate) {
        teamMemberData.joinedDate = Timestamp.fromDate(input.joinedDate);
      } else {
        teamMemberData.joinedDate = now;
      }
      if (input.socialMedia) {
        teamMemberData.socialMedia = input.socialMedia;
      }
      if (input.role === 'player') {
        teamMemberData.stats = this.getDefaultPlayerStats();
      }

      const docRef = await addDoc(this.collection, teamMemberData);
      const teamMember: TeamMember = {
        id: docRef.id,
        ...teamMemberData,
      };

      return {
        success: true,
        data: teamMember,
      };
    } catch (error) {
      console.error('Error creating team member:', error);
      return {
        success: false,
        error: 'Failed to create team member. Please try again.',
      };
    }
  }

  /**
   * Bulk create team members
   */
  async createTeamMembers(inputs: TeamMemberInput[]): Promise<TeamMembersResult> {
    try {
      const batch = writeBatch(db);
      const teamMembers: TeamMember[] = [];
      const now = Timestamp.now();

      for (const input of inputs) {
        // Validate each input
        const validationErrors = this.validateTeamMemberInput(input);
        if (validationErrors.length > 0) {
          return {
            success: false,
            error: `Validation errors for ${input.name}: ${validationErrors.map(e => e.message).join(', ')}`,
          };
        }

        const docRef = doc(this.collection);
        const teamMemberData: Omit<TeamMember, 'id'> = {
          name: input.name.trim(),
          role: input.role,
          title: input.title?.trim(),
          position: input.position?.trim(),
          jerseyNumber: input.jerseyNumber,
          photoURL: input.photoURL,
          bio: input.bio?.trim(),
          dateOfBirth: input.dateOfBirth ? Timestamp.fromDate(input.dateOfBirth) : undefined,
          nationality: input.nationality?.trim(),
          height: input.height,
          weight: input.weight,
          joinedDate: input.joinedDate ? Timestamp.fromDate(input.joinedDate) : now,
          socialMedia: input.socialMedia,
          stats: input.role === 'player' ? this.getDefaultPlayerStats() : undefined,
          isActive: input.isActive ?? true,
          createdAt: now,
          updatedAt: now,
        };

        batch.set(docRef, teamMemberData);
        teamMembers.push({
          id: docRef.id,
          ...teamMemberData,
        });
      }

      await batch.commit();

      return {
        success: true,
        data: {
          data: teamMembers,
          hasMore: false,
          total: teamMembers.length,
        },
      };
    } catch (error) {
      console.error('Error creating team members:', error);
      return {
        success: false,
        error: 'Failed to create team members. Please try again.',
      };
    }
  }

  // ==========================================================================
  // READ OPERATIONS
  // ==========================================================================

  /**
   * Get all team members with optional filtering and pagination
   */
  async getTeamMembers(options: TeamMemberQueryOptions = {}): Promise<TeamMembersResult> {
    try {
      let q = query(this.collection);

      // Apply filters
      if (options.role) {
        q = query(q, where('role', '==', options.role));
      }

      if (options.isActive !== undefined) {
        q = query(q, where('isActive', '==', options.isActive));
      }

      // Apply ordering
      const orderField = options.orderBy || 'name';
      const orderDirection = options.orderDirection || 'asc';
      q = query(q, orderBy(orderField, orderDirection));

      // Apply pagination
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      const teamMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamMember[];

      // Apply search filter if provided (client-side)
      let filteredMembers = teamMembers;
      if (options.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredMembers = teamMembers.filter(member =>
          member.name.toLowerCase().includes(searchLower) ||
          member.title?.toLowerCase().includes(searchLower) ||
          member.position?.toLowerCase().includes(searchLower)
        );
      }

      return {
        success: true,
        data: {
          data: filteredMembers,
          hasMore: snapshot.docs.length === (options.limit || 0),
          total: filteredMembers.length,
          lastDoc: snapshot.docs[snapshot.docs.length - 1],
        },
      };
    } catch (error) {
      console.error('Error getting team members:', error);
      return {
        success: false,
        error: 'Failed to fetch team members. Please try again.',
      };
    }
  }

  /**
   * Get team member by ID
   */
  async getTeamMemberById(id: string): Promise<TeamMemberResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const teamMember: TeamMember = {
          id: docSnap.id,
          ...docSnap.data(),
        } as TeamMember;

        return {
          success: true,
          data: teamMember,
        };
      } else {
        return {
          success: false,
          error: 'Team member not found.',
        };
      }
    } catch (error) {
      console.error('Error getting team member:', error);
      return {
        success: false,
        error: 'Failed to fetch team member. Please try again.',
      };
    }
  }

  /**
   * Get team member by jersey number
   */
  async getTeamMemberByJerseyNumber(jerseyNumber: number): Promise<TeamMember | null> {
    try {
      const q = query(
        this.collection,
        where('jerseyNumber', '==', jerseyNumber),
        where('isActive', '==', true),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as TeamMember;
      }
      return null;
    } catch (error) {
      console.error('Error getting team member by jersey number:', error);
      return null;
    }
  }

  /**
   * Get team members by role
   */
  async getTeamMembersByRole(role: TeamMemberRole): Promise<TeamMembersResult> {
    return this.getTeamMembers({ role, isActive: true });
  }

  /**
   * Get active players with stats
   */
  async getActivePlayers(): Promise<TeamMembersResult> {
    return this.getTeamMembers({
      role: 'player',
      isActive: true,
      orderBy: 'jerseyNumber',
      orderDirection: 'asc',
    });
  }

  // ==========================================================================
  // UPDATE OPERATIONS
  // ==========================================================================

  /**
   * Update team member
   */
  async updateTeamMember(
    id: string,
    input: Partial<TeamMemberInput>,
    photoFile?: File
  ): Promise<TeamMemberResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Team member not found.',
        };
      }

      const currentData = docSnap.data() as TeamMember;

      // Check for duplicate jersey number if updating
      if (input.jerseyNumber && input.jerseyNumber !== currentData.jerseyNumber) {
        const duplicate = await this.getTeamMemberByJerseyNumber(input.jerseyNumber);
        if (duplicate && duplicate.id !== id) {
          return {
            success: false,
            error: `Jersey number ${input.jerseyNumber} is already taken.`,
          };
        }
      }

      let photoURL = input.photoURL;

      // Upload new photo if provided
      if (photoFile) {
        // Delete old photo if it exists
        if (currentData.photoURL) {
          await this.deleteTeamMemberPhoto(currentData.photoURL);
        }

        const photoUploadResult = await this.uploadTeamMemberPhoto(photoFile);
        if (photoUploadResult.success) {
          photoURL = photoUploadResult.url;
        }
      }

      const updateData: Partial<TeamMember> = {
        ...input,
        photoURL,
        dateOfBirth: input.dateOfBirth ? Timestamp.fromDate(input.dateOfBirth) : undefined,
        joinedDate: input.joinedDate ? Timestamp.fromDate(input.joinedDate) : undefined,
        updatedAt: Timestamp.now(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof TeamMember] === undefined) {
          delete updateData[key as keyof TeamMember];
        }
      });

      await updateDoc(docRef, updateData);

      // Get updated document
      const updatedDocSnap = await getDoc(docRef);
      const updatedTeamMember: TeamMember = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as TeamMember;

      return {
        success: true,
        data: updatedTeamMember,
      };
    } catch (error) {
      console.error('Error updating team member:', error);
      return {
        success: false,
        error: 'Failed to update team member. Please try again.',
      };
    }
  }

  /**
   * Update player stats
   */
  async updatePlayerStats(id: string, stats: Partial<PlayerStats>): Promise<TeamMemberResult> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Player not found.',
        };
      }

      const currentData = docSnap.data() as TeamMember;
      if (currentData.role !== 'player') {
        return {
          success: false,
          error: 'Can only update stats for players.',
        };
      }

      const updatedStats: PlayerStats = {
        ...currentData.stats,
        ...stats,
      } as PlayerStats;

      await updateDoc(docRef, {
        stats: updatedStats,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedPlayer: TeamMember = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as TeamMember;

      return {
        success: true,
        data: updatedPlayer,
      };
    } catch (error) {
      console.error('Error updating player stats:', error);
      return {
        success: false,
        error: 'Failed to update player stats. Please try again.',
      };
    }
  }

  // ==========================================================================
  // DELETE OPERATIONS
  // ==========================================================================

  /**
   * Delete team member (soft delete by setting isActive to false)
   */
  async deactivateTeamMember(id: string): Promise<TeamMemberResult> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now(),
      });

      const updatedDocSnap = await getDoc(docRef);
      const updatedTeamMember: TeamMember = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as TeamMember;

      return {
        success: true,
        data: updatedTeamMember,
      };
    } catch (error) {
      console.error('Error deactivating team member:', error);
      return {
        success: false,
        error: 'Failed to deactivate team member. Please try again.',
      };
    }
  }

  /**
   * Permanently delete team member
   */
  async deleteTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Team member not found.',
        };
      }

      const teamMember = docSnap.data() as TeamMember;

      // Delete photo if it exists
      if (teamMember.photoURL) {
        await this.deleteTeamMemberPhoto(teamMember.photoURL);
      }

      await deleteDoc(docRef);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting team member:', error);
      return {
        success: false,
        error: 'Failed to delete team member. Please try again.',
      };
    }
  }

  // ==========================================================================
  // REAL-TIME LISTENERS
  // ==========================================================================

  /**
   * Subscribe to team members changes
   */
  subscribeToTeamMembers(
    callback: (teamMembers: TeamMember[]) => void,
    options: TeamMemberQueryOptions = {}
  ): () => void {
    let q = query(this.collection);

    // Apply filters
    if (options.role) {
      q = query(q, where('role', '==', options.role));
    }

    if (options.isActive !== undefined) {
      q = query(q, where('isActive', '==', options.isActive));
    }

    // Apply ordering
    const orderField = options.orderBy || 'name';
    const orderDirection = options.orderDirection || 'asc';
    q = query(q, orderBy(orderField, orderDirection));

    return onSnapshot(q, (snapshot) => {
      const teamMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamMember[];

      callback(teamMembers);
    });
  }

  /**
   * Subscribe to single team member changes
   */
  subscribeToTeamMember(id: string, callback: (teamMember: TeamMember | null) => void): () => void {
    const docRef = doc(this.collection, id);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const teamMember: TeamMember = {
          id: doc.id,
          ...doc.data(),
        } as TeamMember;
        callback(teamMember);
      } else {
        callback(null);
      }
    });
  }

  // ==========================================================================
  // FILE UPLOAD OPERATIONS
  // ==========================================================================

  /**
   * Upload team member photo
   */
  private async uploadTeamMemberPhoto(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        url: downloadURL,
      };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return {
        success: false,
        error: 'Failed to upload photo. Please try again.',
      };
    }
  }

  /**
   * Delete team member photo
   */
  private async deleteTeamMemberPhoto(photoURL: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(photoURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      // Don't throw error for photo deletion failures
      console.warn('Failed to delete photo:', error);
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Validate team member input
   */
  private validateTeamMemberInput(input: TeamMemberInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!input.name || input.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!input.role) {
      errors.push({ field: 'role', message: 'Role is required' });
    }

    // Validate jersey number for players
    if (input.role === 'player' && input.jerseyNumber) {
      if (input.jerseyNumber < 1 || input.jerseyNumber > 99) {
        errors.push({ field: 'jerseyNumber', message: 'Jersey number must be between 1 and 99' });
      }
    }

    // Validate height and weight
    if (input.height && (input.height < 50 || input.height > 250)) {
      errors.push({ field: 'height', message: 'Height must be between 50 and 250 cm' });
    }

    if (input.weight && (input.weight < 30 || input.weight > 200)) {
      errors.push({ field: 'weight', message: 'Weight must be between 30 and 200 kg' });
    }

    return errors;
  }

  /**
   * Get default player stats
   */
  private getDefaultPlayerStats(): PlayerStats {
    return {
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
    };
  }

  /**
   * Get team member collection reference
   */
  getCollectionRef() {
    return this.collection;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const teamService = new TeamService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get available jersey numbers for players
 */
export const getAvailableJerseyNumbers = async (): Promise<number[]> => {
  const playersResult = await teamService.getTeamMembersByRole('player');
  if (!playersResult.success || !playersResult.data) {
    return Array.from({ length: 99 }, (_, i) => i + 1);
  }

  const usedNumbers = playersResult.data.data
    .filter(player => player.jerseyNumber)
    .map(player => player.jerseyNumber as number);

  return Array.from({ length: 99 }, (_, i) => i + 1)
    .filter(num => !usedNumbers.includes(num));
};

/**
 * Format team member display name
 */
export const formatTeamMemberName = (member: TeamMember): string => {
  if (member.title) {
    return `${member.name} (${member.title})`;
  }
  if (member.jerseyNumber && member.role === 'player') {
    return `${member.name} #${member.jerseyNumber}`;
  }
  return member.name;
};

/**
 * Get team member role display name
 */
export const getRoleDisplayName = (role: TeamMemberRole): string => {
  const roleNames: Record<TeamMemberRole, string> = {
    management: 'Management',
    coach: 'Coach',
    player: 'Player',
    staff: 'Staff',
  };
  return roleNames[role];
};
