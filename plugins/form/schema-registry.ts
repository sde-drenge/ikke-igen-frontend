import { loginSchema } from "@/app/log-ind/schemas";
import {
  technicalDataSignupSchema,
  updateProfileSignupSchema,
  verificationsCodeSignupSchema,
} from "@/app/opret-konto/schemas";

export const schemaMap = {
  login: loginSchema,
  "technical-data-signup": technicalDataSignupSchema,
  "verifications-code-signup": verificationsCodeSignupSchema,
  "update-profile-signup": updateProfileSignupSchema,
} as const;

type SchemaMap = typeof schemaMap;
export type SchemaName = keyof SchemaMap;
