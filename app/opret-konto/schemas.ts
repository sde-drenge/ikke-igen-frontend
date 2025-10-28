import z from "zod/v3";
import {
  emailSchema,
  objectIdSchema,
  passwordSchema,
} from "@/plugins/form/schemas";

export const technicalDataSignupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password2: passwordSchema,
  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Adgangskoderne stemmer ikke overens",
  });

export const verificationsCodeSignupSchema = z.object({
  uuid: objectIdSchema,
  verificationCode: z
    .string()
    .length(6, "Verifikationskoden skal være 6 tegn lang")
    .regex(/^[\dA-Za-z]+$/, "Ugyldig verifikationskode"),
});

export const updateProfileSignupSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ugyldigt fornavn")
    .max(64, "Kan ikke være længere end 64 tegn"),
  lastName: z
    .string()
    .min(1, "Ugyldigt efternavn")
    .max(64, "Kan ikke være længere end 64 tegn"),
  phoneNumber: z.string().optional(),
  schoolUuid: objectIdSchema,
  education: z.string().min(1, "Påkrævet"),
});
