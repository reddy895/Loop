/**
 * @file authConfig.ts
 * @description Central NextAuth (Auth.js) options configuration.
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "@/config/envConfig";

/**
 * NextAuth options configuration object.
 */
export const authOptions: NextAuthOptions = {
  secret: config.nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Placeholder authentication logic - integrates with AuthService
        return {
          id: "placeholder-user-id",
          email: credentials.email,
          name: "Project LOOP User",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { id?: string } }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token as unknown as import("next-auth/jwt").JWT;
    },
    async session({ session, token }: { session: import("next-auth").Session; token: Record<string, unknown> }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
