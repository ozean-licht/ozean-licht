/**
 * NextAuth TypeScript declarations for Kids Ascension
 *
 * Extends NextAuth types with Kids Ascension-specific user and session data.
 */

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User ID from shared_users_db */
      id: string
      /** UserEntity ID for Kids Ascension */
      entityId: string
      /** User role within Kids Ascension platform */
      entityRole: "USER" | "CREATOR" | "EDUCATOR" | "ADMIN" | "MODERATOR" | "SUPPORT"
      /** Email verification status */
      emailVerified: boolean
    } & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned by the authorize callback
   */
  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    /** UserEntity ID for Kids Ascension */
    entityId: string
    /** User role within Kids Ascension platform */
    entityRole: "USER" | "CREATOR" | "EDUCATOR" | "ADMIN" | "MODERATOR" | "SUPPORT"
    /** Email verification status */
    emailVerified: boolean
  }
}

declare module "@auth/core/jwt" {
  /**
   * Returned by the `jwt` callback when using JWT sessions
   */
  interface JWT {
    /** UserEntity ID for Kids Ascension */
    entityId?: string
    /** User role within Kids Ascension platform */
    entityRole?: "USER" | "CREATOR" | "EDUCATOR" | "ADMIN" | "MODERATOR" | "SUPPORT"
    /** Email verification status */
    emailVerified?: boolean
  }
}
