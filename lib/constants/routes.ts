export const ROUTES = {
  FRONTPAGE: "/",
  LOGIN: "/log-ind",
  SIGNUP: "/opret-konto",
  WRITE_A_REVIEW: "/skriv-en-anmeldelse",
  REVIEW: (uuid: Workplace["uuid"]) => `/anmeldelse/${uuid}`,
  EVALUATE: (uuid: Workplace["uuid"]) => `/vurdere/${uuid}`,
  VERIFY_REVIEWS: "/verificere-anmeldelser",
} as const;
