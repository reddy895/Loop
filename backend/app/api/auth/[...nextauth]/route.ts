/**
 * @file app/api/auth/[...nextauth]/route.ts
 * @description NextAuth v4 API handler routing all NextAuth authentication requests.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/auth/authConfig";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
