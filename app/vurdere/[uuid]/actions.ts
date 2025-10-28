"use server";

import api from "@/lib/api";
import { withValidation } from "@/plugins/form/validation/with-validation";
import { createReviewSchema } from "./schemas";

export const createReviewAction = withValidation(
  createReviewSchema,
  async (validatedData) => {
    const { workplaceUuid, ...rest } = validatedData;

    await api.post(`/workplaces/${workplaceUuid}/review/`, {
      ...rest,
      stars: rest.stars.toString(),
    });

    return { success: "Anmeldelse er blevet oprettet!", status: 200 };
  }
);
