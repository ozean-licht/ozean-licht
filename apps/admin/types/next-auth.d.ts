import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `auth` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      adminUserId: string
      adminRole: string
      permissions: string[]
      entityScope: string | null
    } & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string
    email: string
    adminUserId: string
    adminRole: string
    permissions: string[]
    entityScope: string | null
  }
}

declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    adminUserId?: string
    adminRole?: string
    permissions?: string[]
    entityScope?: string | null
  }
}
