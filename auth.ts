import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
      params: {
        prompt: "select_account",
      },
    },
  }),
],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      // Existing Google/email account — allow normal login.
      if (existingUser) {
        return true;
      }

      // New Google signup — retrieve the selected role.
      const cookieStore = await cookies();
      const signupRole = cookieStore.get("musha_signup_role")?.value;

      const role =
        signupRole === "LANDLORD" ? "LANDLORD" : "STUDENT";

      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: null,
          role,
          verified: true,
        },
      });

      return true;
    },
  },
});