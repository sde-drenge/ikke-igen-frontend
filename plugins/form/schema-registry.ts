import { loginSchema } from "@/app/log-ind/schemas";
import {
  technicalDataSignupSchema,
  updateProfileSignupSchema,
  verificationsCodeSignupSchema,
} from "@/app/opret-konto/schemas";
import {
  inviteTeacherSchema,
  kickTeacherSchema,
} from "@/app/skole-arbejdere/schemas";
import { createReviewSchema } from "@/app/vurdere/[uuid]/schemas";

export const schemaMap = {
  login: loginSchema,
  "technical-data-signup": technicalDataSignupSchema,
  "verifications-code-signup": verificationsCodeSignupSchema,
  "update-profile-signup": updateProfileSignupSchema,
  "create-review": createReviewSchema,

  "kick-teacher": kickTeacherSchema,
  "invite-teacher": inviteTeacherSchema,
} as const;

type SchemaMap = typeof schemaMap;
export type SchemaName = keyof SchemaMap;
