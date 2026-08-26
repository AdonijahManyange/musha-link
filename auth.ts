import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    // ==========================================================
    // GOOGLE
    // ==========================================================

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),

    // ==========================================================
    // EMAIL + PASSWORD
    // ==========================================================

    Credentials({
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email
          .trim()
          .toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatches =
          await comparePassword(
            credentials.password,
            user.password
          );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // ============================================================
  // CALLBACKS
  // ============================================================

  callbacks: {
    // ==========================================================
    // SIGN IN
    // ==========================================================

    async signIn({ user, account }) {
      /*
       * Only apply the special account-creation logic
       * to Google authentication.
       *
       * Credentials users are handled by authorize().
       */

      if (
        account?.provider !== "google" ||
        !user.email
      ) {
        return true;
      }

      const email = user.email
        .trim()
        .toLowerCase();

      // --------------------------------------------------------
      // Check whether this Google account already exists
      // --------------------------------------------------------

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      // Existing account → allow normal login.
      if (existingUser) {
        return true;
      }

      // --------------------------------------------------------
      // New Google account
      // --------------------------------------------------------

      const cookieStore = await cookies();

      const signupRole =
        cookieStore.get(
          "musha_signup_role"
        )?.value;

      /*
       * IMPORTANT:
       *
       * If there is no signup role, this Google login came
       * from the LOGIN page rather than the SIGNUP page.
       *
       * We must NOT automatically create the account as
       * STUDENT.
       *
       * Send the user to signup so they can choose:
       *
       *   Student
       *   Landlord
       */

      if (
        signupRole !== "STUDENT" &&
        signupRole !== "LANDLORD"
      ) {
        return "/auth/signup";
      }

      // --------------------------------------------------------
      // Create the new account using the selected role
      // --------------------------------------------------------

      await prisma.user.create({
        data: {
          name: user.name,
          email,
          password: null,

          role:
            signupRole === "LANDLORD"
              ? "LANDLORD"
              : "STUDENT",

          verified: true,
        },
      });

      // --------------------------------------------------------
      // Account created successfully
      // --------------------------------------------------------

      return true;
    },

    // ==========================================================
    // JWT
    // ==========================================================

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }

      return token;
    },

    // ==========================================================
    // SESSION
    // ==========================================================

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.userId as string;

        session.user.role =
          token.role as
            | "STUDENT"
            | "LANDLORD"
            | "ADMIN";
      }

      return session;
    },
  },
});