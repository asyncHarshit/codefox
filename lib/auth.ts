import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["repo"],
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://adrianne-auriferous-stefanie.ngrok-free.dev",
  ],

  cookies: {
    sameSite: "lax",   // REQUIRED for OAuth redirects
    secure: true,      // REQUIRED because ngrok = https
  },
});
