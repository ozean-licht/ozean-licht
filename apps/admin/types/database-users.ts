/**
 * Database row types for users tables
 * Raw PostgreSQL row types from shared_users_db
 */

/**
 * Raw row from users table
 */
export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Raw row from user_entities table
 */
export interface UserEntityRow {
  id: string;
  user_id: string;
  entity_id: 'kids_ascension' | 'ozean_licht';
  role: string;
  created_at: string;
}

/**
 * Raw row from oauth_providers table
 */
export interface OAuthProviderRow {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  created_at: string;
}

/**
 * Joined user row with entity access
 */
export interface UserWithEntitiesRow {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  entities: string; // JSON aggregated array of entity objects
}
