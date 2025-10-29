"use server";

import api from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { objectIdSchema } from "@/plugins/form/schemas";
import { withValidation } from "@/plugins/form/validation/with-validation";
import { revalidatePath } from "next/cache";
import z from "zod/v3";

const reviewSchema = z.object({
  reviewUuid: objectIdSchema,
  verify: z.boolean(),
});

export const reviewAction = withValidation(
  reviewSchema,
  async (validatedData) => {
    const { verify, reviewUuid } = validatedData;

    if (verify) {
      await api.post(`/workplaces/reviews/${reviewUuid}/verify/`);
    } else {
      await api.delete(`/workplaces/reviews/${reviewUuid}/decline/`);
    }

    revalidatePath(ROUTES.VERIFY_REVIEWS, "page");

    return { success: "Anmeldelse er blevet verificeret!", status: 200 };
  }
);
