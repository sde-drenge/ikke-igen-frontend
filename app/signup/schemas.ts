import z from "zod/v3";
import { emailSchema, passwordSchema } from "@/plugins/form/schemas";

export const technicalDataSignupSchema = z
  .object({
    email: emailSchema(),
    password: passwordSchema(),
    password2: passwordSchema(),
    translations: z.object({
      aVerificationCodeHasBeenSentToYourEmail: z.string(),
    }),
  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Adgangskoderne stemmer ikke overens",
  });
