import { emailSchema, objectIdSchema } from "@/plugins/form/schemas";
import z from "zod/v3";

export const inviteTeacherSchema = z.object({
  email: emailSchema,
});

export const kickTeacherSchema = z.object({
  uuid: objectIdSchema,
  name: z.string(),
});
