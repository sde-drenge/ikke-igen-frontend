import { emailSchema } from "@/plugins/form/schemas";

import { z } from "zod";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Påkrævet" }),
  translations: z.object({
    wrongEmailOrPassword: z.string(),
    youAreNowLoggedIn: z.string(),
    youreAlmostTherePleaseVerifyYourEmailAddress: z.string(),
  }),
});
