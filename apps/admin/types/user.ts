/**
 * User domain types
 * Application-level types for user management
 */

/**
 * Entity access type
 */
export type EntityType = 'kids_ascension' | 'ozean_licht';

/**
 * User entity association
 */
export interface UserEntity {
  id: string;
  userId: string;
  entityId: EntityType;
  role: string; // 'user' | 'admin' | 'moderator' (platform role, not admin_users role)
  createdAt: Date;
}

/**
 * User with entity access
 */
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  entities: UserEntity[]; // Associated entities
}

/**
 * Filters for listing users
 */
export interface UserFilters {
  // Search
  search?: string; // Email or user ID

  // Entity access
  entityId?: EntityType | 'both'; // 'kids_ascension' | 'ozean_licht' | 'both' | undefined (all)

  // Email verification
  emailVerified?: boolean;

  // Date range
  createdAfter?: Date;
  createdBefore?: Date;

  // Pagination
  limit?: number;
  offset?: number;
}

/**
 * Paginated user list response
 */
export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * User detail with extended information
 */
export interface UserDetail extends User {
  // OAuth providers
  oauthProviders: {
    id: string;
    provider: string; // 'google' | 'facebook'
    providerUserId: string;
    createdAt: Date;
  }[];

  // Activity
  lastLoginAt: Date | null;
  loginCount: number;
}
