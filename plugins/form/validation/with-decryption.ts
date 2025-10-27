import { ZodSchema, z } from "zod/v3";

import { decryptData } from "../crypt/server";
import { shapeError } from "./utils";

type Handler<TValidated extends Record<string, unknown>, TData> = (
  validatedData: TValidated
) => Promise<ActionResponse<TData>>;

export function withDecryptionAndValidation<
  SchemaFactory extends ZodSchema,
  SchemaResult extends Record<string, unknown> = z.infer<SchemaFactory> & {
    encryptedFields: string;
  },
  TResponseData = unknown
>(schemaFactory: SchemaFactory, handler: Handler<SchemaResult, TResponseData>) {
  return async (
    formData: SchemaResult & { encryptedFields: string }
  ): Promise<ActionResponse<TResponseData>> => {
    let mergedData = { ...formData };

    if (typeof mergedData.encryptedFields === "string") {
      try {
        const decryptedFields = decryptData(
          mergedData.encryptedFields
        ) as SchemaResult;
        mergedData = { ...mergedData, ...decryptedFields };
      } catch {
        return {
          status: 400,
          error: "Ugyldige data",
        } as ActionResponse<TResponseData>;
      }
    }

    const parsed = schemaFactory.safeParse(mergedData);

    if (!parsed.success) {
      return {
        status: 400,
        error: "Ugyldige data",
        validationErrors: parsed.error.errors,
      } as ActionResponse<TResponseData>;
    }

    const finalData = {
      ...mergedData,
      ...parsed.data,
    };

    let response: ActionResponse<TResponseData>;

    try {
      response = await handler(finalData as SchemaResult);
    } catch (error) {
      const shapedError = shapeError(error);

      return {
        status: shapedError.status,
        error: shapedError.error,
      } as ActionResponse<TResponseData>;
    }

    return response;
  };
}
