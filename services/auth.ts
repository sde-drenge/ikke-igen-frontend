import api from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import type { NextAuthConfig } from "next-auth";
import { SignJWT, jwtVerify } from "jose";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { COOKIES } from "@/lib/constants/cookies";

export const { auth, signIn, handlers, unstable_update } = NextAuth({
  pages: {
    signIn: ROUTES.LOGIN,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<
          Record<"email" | "password" | "encryptedFields", unknown>
        >
      ) {
        const encryptedFields = credentials?.encryptedFields;

        if (!encryptedFields) {
          return null;
        }

        type LoginResponse = (User & { jwtToken: string }) | null;

        const response = await api.post<LoginResponse>("/users/login/", {
          encryptedFields,
        });

        const data = response.data;

        if (!data || !data.isActive || !data.jwtToken) {
          return null;
        }

        let decryptedJwtToken: { user_id: number; token: string };

        try {
          const { payload }: { payload: { user_id: number; token: string } } =
            await jwtVerify(
              data.jwtToken!,
              new TextEncoder().encode(process.env.SECRET_KEY),
              {
                algorithms: ["HS256"],
              }
            );
          decryptedJwtToken = payload;
        } catch {
          return null;
        }

        return {
          uuid: data.uuid,
          email: data.email,
          name: data.firstName + " " + data.lastName,
          isActive: data.isActive,
          profileColor: data.profileColor,
          user_id: decryptedJwtToken.user_id,
          token: decryptedJwtToken.token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: COOKIES.SESSION_TOKEN.maxAge,
    updateAge: 60 * 60 * 24, // refresh token every 24 hours
  },
  jwt: {
    encode: async ({ secret, token }) => {
      return new SignJWT({ ...token })
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(secret as string));
    },
    decode: async ({ secret, token }) => {
      try {
        const { payload } = await jwtVerify(
          token!,
          new TextEncoder().encode(secret as string),
          {
            algorithms: ["HS256"],
          }
        );
        return payload;
      } catch {
        return null;
      }
    },
  },
  secret: process.env.SECRET_KEY,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uuid = user.id;
        token.user_id = user.user_id;
        token.isActive = user.isActive;
        token.email = user.email;
        token.profileColor = user.profileColor;
        token.token = user.token;
      }

      if (trigger === "update") {
        token.name = session?.user?.name || token.name;
        token.email = session?.user?.email || token.email;
        token.isActive = session?.user?.isActive || token.isActive;
        token.profileColor = session?.user?.profileColor || token.profileColor;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          uuid: token.uuid as string,
          email: token.email as string,
          isActive: token.isActive as boolean,
          profileColor: token.profileColor as string,
        },
      };
    },
    async authorized() {
      return true;
    },
  },
  cookies: {
    csrfToken: {
      name: COOKIES.CSRF_TOKEN,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
    sessionToken: {
      name: COOKIES.SESSION_TOKEN.name,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig);
