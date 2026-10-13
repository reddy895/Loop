/**
 * @file authConfig.ts
 * @description Central NextAuth (Auth.js) options configuration.
 * Configures Credentials provider with secure credential verification and JWT session strategy.
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "@/config/envConfig";
import { authService } from "@/services";

/**
 * NextAuth options configuration object.
 */
export const authOptions: NextAuthOptions = {
  secret: config.nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: config.isProduction && (process.env.NEXTAUTH_URL?.startsWith("https://") ?? false),
  cookies: {
    sessionToken: {
      name: (config.isProduction && (process.env.NEXTAUTH_URL?.startsWith("https://") ?? false))
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: config.isProduction && (process.env.NEXTAUTH_URL?.startsWith("https://") ?? false),
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Corporate Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await authService.validateUserCredentials(
            credentials.email,
            credentials.password
          );

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: (user as any).role || "ADMIN",
            jobTitle: (user as any).jobTitle || "Product Lead",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "ADMIN";
        token.jobTitle = (user as any).jobTitle || "Product Lead";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "ADMIN";
        (session.user as any).jobTitle = (token.jobTitle as string) || "Product Lead";
      }
      return session;
    },
  },
};
