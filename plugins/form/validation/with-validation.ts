import { File } from "node:buffer";
import { ZodSchema, z } from "zod/v3";

import { shapeError, validateForm } from "./utils";

type Handler<TValidated extends Record<string, unknown>, TData> = (
  validatedData: TValidated
) => Promise<ActionResponse<TData>>;

type WithValidationOptions = {
  upload?: {
    uploadFields: string[];
    uploadLocation: string;
    uploadFileFunction: (
      file: File,
      fieldName: string,
      location: string
    ) => Promise<string>;
  };
  requireAuth?: boolean;
};

export function withValidation<
  SchemaFactory extends ZodSchema,
  SchemaResult extends Record<string, unknown> = z.infer<SchemaFactory>,
  TResponseData = unknown
>(
  schemaFactory: SchemaFactory,
  handler: Handler<SchemaResult, TResponseData>,
  options?: WithValidationOptions
) {
  return async (
    formData: SchemaResult
  ): Promise<ActionResponse<TResponseData>> => {
    const validationResult = await validateForm(
      schemaFactory,
      formData,
      options?.requireAuth
    );

    if (!validationResult.success) {
      return {
        error: validationResult.error,
        status: validationResult.status,
        validationErrors: validationResult.validationErrors,
      } as ActionResponse<TResponseData>;
    }

    const validatedData = { ...validationResult.data };

    if (options?.upload) {
      const upload = options.upload;

      for (const fieldName of upload.uploadFields) {
        const maybeFile = validatedData[fieldName];
        const location = upload.uploadLocation;
        const uploadFileFunction = upload.uploadFileFunction;

        if (
          maybeFile instanceof File &&
          maybeFile.size > 0 &&
          location &&
          uploadFileFunction
        ) {
          const url = await uploadFileFunction(maybeFile, fieldName, location);

          (validatedData as Record<string, unknown>)[fieldName] = url;
        }
      }
    }

    let response: ActionResponse<TResponseData>;

    try {
      response = await handler(validatedData);
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
