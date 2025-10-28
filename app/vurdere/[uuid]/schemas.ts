import { objectIdSchema } from "@/plugins/form/schemas";
import z from "zod/v3";

export const createReviewSchema = z.object({
  workplaceUuid: objectIdSchema,
  stars: z.number().min(1, "Min 1 stjerne").max(5, "Max 5 stjerner"),
  title: z
    .string()
    .min(5, "Titlen skal være mindst 5 tegn")
    .max(255, "Titlen må maksimalt være 255 tegn"),
  comment: z.string().min(10, "Kommentaren skal være mindst 10 tegn"),
});
