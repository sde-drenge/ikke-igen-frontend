import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const environment = createEnv({
  server: {
    // ─── Core ───────────────────────────────────────────────
    NODE_ENV: z.string().optional(),
    NEXT_PRIVATE_API_URL: z.string().url(),

    // ─── Auth / JWT ────────────────────────────────────────
    SECRET_KEY: z.string().min(1),
    PRIVATE_KEY_PEM: z.string().min(1),
  },

  client: {
    // ─── Core ───────────────────────────────────────────────
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PRIVATE_API_URL: process.env.NEXT_PRIVATE_API_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    PRIVATE_KEY_PEM: process.env.PRIVATE_KEY_PEM,

    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
