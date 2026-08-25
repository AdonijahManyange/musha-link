import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "STUDENT" | "LANDLORD" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "LANDLORD" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: "STUDENT" | "LANDLORD" | "ADMIN";
  }
}