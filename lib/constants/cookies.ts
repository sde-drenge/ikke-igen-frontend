export const COOKIES = {
  CSRF_TOKEN: "authjs.csrf-token",
  SESSION_TOKEN: {
    name: "authjs.session-token",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  CALLBACK_URL: "authjs.callback-url",
} as const;
