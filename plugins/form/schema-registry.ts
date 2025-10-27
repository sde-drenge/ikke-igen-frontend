import { loginSchema } from "@/app/log-ind/schemas";
import { technicalDataSignupSchema } from "@/app/opret-konto/schemas";

export const schemaMap = {
  login: loginSchema,
  signup: technicalDataSignupSchema,
} as const;

type SchemaMap = typeof schemaMap;
export type SchemaName = keyof SchemaMap;
