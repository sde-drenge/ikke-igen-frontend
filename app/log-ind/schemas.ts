import { emailSchema } from "@/plugins/form/schemas";

import { z } from "zod/v3";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Påkrævet" }),
});
