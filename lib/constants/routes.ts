export const ROUTES = {
  FRONTPAGE: "/",
  LOGIN: "/log-ind",
  SIGNUP: "/opret-konto",
  WRITE_A_REVIEW: "/skriv-en-anmeldelse",
  EVALUATE: (uuid: Workplace["uuid"]) => `/vurdere/${uuid}`,
  VERIFY_REVIEWS: "/verificere-anmeldelser",
} as const;
