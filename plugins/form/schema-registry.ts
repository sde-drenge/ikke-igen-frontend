import { loginSchema } from "@/app/login/schemas";
import { technicalDataSignupSchema } from "@/app/signup/schemas";

export const schemaMap = {
  login: loginSchema,
  signup: technicalDataSignupSchema,
} as const;

type SchemaMap = typeof schemaMap;
export type SchemaName = keyof SchemaMap;
