import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";

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

  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider !== "google" ||
        !user.email
      ) {
        return true;
      }

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

      if (existingUser) {
        return true;
      }

      const cookieStore = await cookies();

      const signupRole =
        cookieStore.get(
          "musha_signup_role"
        )?.value;

      const role =
        signupRole === "LANDLORD"
          ? "LANDLORD"
          : "STUDENT";

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

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }

      return token;
    },

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