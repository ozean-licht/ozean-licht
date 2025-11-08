/**
 * NextAuth Configuration for Kids Ascension
 *
 * Unified authentication using shared_users_db with multi-tenant UserEntity support.
 * Migrates from Supabase Auth to NextAuth v5 with credentials provider.
 *
 * Related Files:
 * - /shared/database/prisma/schema.prisma (User, UserEntity models)
 * - /apps/admin/lib/auth/config.ts (admin auth reference)
 * - /apps/kids-ascension/kids-ascension_OLD/kids-ascension-web/lib/supabase/auth.ts (legacy)
 */

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { PrismaClient } from "@prisma/client-shared-users"
import bcrypt from "bcryptjs"

// Initialize Prisma Client for shared_users_db
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SHARED_USERS_DB_URL,
    },
  },
})

/**
 * Verify password hash using bcrypt
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Hash password using bcrypt (for registration)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * NextAuth configuration for Kids Ascension
 */
const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          // Get user by email from shared_users_db
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: {
              userEntities: {
                where: {
                  entityType: "KIDS_ASCENSION",
                  isActive: true,
                },
              },
            },
          })

          if (!user) {
            throw new Error("Invalid email or password")
          }

          // Check if user is active and not deleted
          if (!user.isActive || user.isDeleted) {
            throw new Error("Account is inactive or deleted")
          }

          // Verify password
          if (!user.passwordHash) {
            throw new Error("Account does not have a password set")
          }

          const isValidPassword = await verifyPassword(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }

          // Check for Kids Ascension entity access
          const kidsAscensionEntity = user.userEntities.find(
            (entity) => entity.entityType === "KIDS_ASCENSION" && entity.isActive
          )

          if (!kidsAscensionEntity) {
            throw new Error("No access to Kids Ascension platform")
          }

          // Update last login timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })

          // Return user object with Kids Ascension entity data
          return {
            id: user.id,
            email: user.email,
            name: user.displayName || user.name,
            image: user.avatarUrl,
            entityId: kidsAscensionEntity.id,
            entityRole: kidsAscensionEntity.role,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error("[Auth] Authorization error:", error)
          throw error
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },

  callbacks: {
    /**
     * JWT callback - enrich token with Kids Ascension entity data
     */
    async jwt({ token, user, trigger, session }) {
      // Enrich JWT with entity data on sign-in
      if (user) {
        token.entityId = user.entityId
        token.entityRole = user.entityRole
        token.emailVerified = user.emailVerified
      }

      // Handle session updates (e.g., profile changes)
      if (trigger === "update" && session) {
        token.name = session.user?.name
        token.email = session.user?.email
        token.picture = session.user?.image
      }

      return token
    },

    /**
     * Session callback - enrich session with JWT token data
     */
    async session({ session, token }) {
      // Enrich session with JWT token data
      if (session.user && token) {
        session.user.id = token.sub as string
        session.user.entityId = token.entityId as string
        session.user.entityRole = token.entityRole as string
        session.user.emailVerified = token.emailVerified as boolean
      }

      return session
    },

    /**
     * Sign-in callback - additional validation
     */
    async signIn({ user }) {
      // Verify user has email verified (optional - can be enforced)
      // For now, allow unverified users but flag in session
      return true
    },
  },

  events: {
    /**
     * Sign-in event - log successful authentication
     */
    async signIn({ user }) {
      console.log("[Auth] User signed in:", {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      })
    },

    /**
     * Sign-out event - log logout
     */
    async signOut({ token }) {
      console.log("[Auth] User signed out:", {
        userId: token?.sub,
        timestamp: new Date().toISOString(),
      })
    },
  },

  debug: process.env.NODE_ENV === "development",
}

/**
 * Export NextAuth handlers and utilities
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

/**
 * Helper function to get current session on server
 */
export async function getSession() {
  return auth()
}

/**
 * Helper function to register a new user
 *
 * @param email - User email
 * @param password - User password
 * @param name - User display name
 * @param role - UserRole (default: USER)
 * @returns Created user with Kids Ascension entity
 */
export async function registerUser(
  email: string,
  password: string,
  name?: string,
  role: "USER" | "CREATOR" | "EDUCATOR" = "USER"
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user and Kids Ascension entity in a transaction
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split("@")[0],
      displayName: name || email.split("@")[0],
      isActive: true,
      emailVerified: false,
      userEntities: {
        create: {
          entityType: "KIDS_ASCENSION",
          role,
          isActive: true,
          metadata: {},
        },
      },
    },
    include: {
      userEntities: true,
    },
  })

  return user
}

/**
 * Helper function to verify user email
 *
 * @param userId - User ID
 */
export async function verifyUserEmail(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      isVerified: true,
    },
  })
}

/**
 * Helper function to update user profile
 *
 * @param userId - User ID
 * @param data - Profile data to update
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    displayName?: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

/**
 * Helper function to get user by ID with entity information
 *
 * @param userId - User ID
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      userEntities: {
        where: {
          entityType: "KIDS_ASCENSION",
          isActive: true,
        },
      },
    },
  })
}

/**
 * Helper function to check if user has specific role
 *
 * @param userId - User ID
 * @param role - Role to check
 */
export async function userHasRole(
  userId: string,
  role: "USER" | "CREATOR" | "EDUCATOR" | "ADMIN" | "MODERATOR" | "SUPPORT"
): Promise<boolean> {
  const userEntity = await prisma.userEntity.findFirst({
    where: {
      userId,
      entityType: "KIDS_ASCENSION",
      role,
      isActive: true,
    },
  })

  return !!userEntity
}

/**
 * Helper function to update user role
 *
 * @param userId - User ID
 * @param newRole - New role
 */
export async function updateUserRole(
  userId: string,
  newRole: "USER" | "CREATOR" | "EDUCATOR" | "ADMIN" | "MODERATOR" | "SUPPORT"
) {
  const userEntity = await prisma.userEntity.findFirst({
    where: {
      userId,
      entityType: "KIDS_ASCENSION",
      isActive: true,
    },
  })

  if (!userEntity) {
    throw new Error("User entity not found")
  }

  return prisma.userEntity.update({
    where: { id: userEntity.id },
    data: { role: newRole },
  })
}

/**
 * Export Prisma client for direct database access
 */
export { prisma }
