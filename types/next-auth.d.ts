import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    uuid: string;
    user_id: number;
    email: string;
    isActive: boolean;
    role: "student" | "teacher";
    profileColor: string;
    token: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
    expires: string;
    error: string;
  }
}
