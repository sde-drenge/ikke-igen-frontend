import { RateLimitError } from "@/lib/errors";
import { auth } from "@/services/auth";

import { ZodSchema, z } from "zod/v3";

type ShapedError = {
  status: number;
  error: string;
};

interface APIErrorResponse {
  response?: {
    status?: number;
    data?: Record<string, string[] | string>;
  };
}

export function shapeError(error: unknown): ShapedError {
  const defaultError = {
    status: 500,
    error: "Something went wrong",
  };

  if (!error || typeof error !== "object") return defaultError;

  if (error instanceof RateLimitError) {
    return { status: 429, error: "Please try again later" };
  }

  const apiError = error as APIErrorResponse;

  console.log(apiError.response);

  if (!apiError.response?.data) {
    return defaultError;
  }

  const { status = 400, data } = apiError.response;

  if (typeof data !== "object") {
    return defaultError;
  }

  for (const [, message] of Object.entries(data)) {
    if (Array.isArray(message) && typeof message[0] === "string") {
      return { status, error: message[0] };
    } else if (typeof message === "string") {
      return { status, error: message };
    }
  }

  return defaultError;
}

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  status: number;
  error: string;
  validationErrors?: z.ZodIssue[];
};

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export async function validateForm<
  SchemaFactory extends ZodSchema,
  SchemaType = z.infer<SchemaFactory>
>(
  schemaFactory: SchemaFactory,
  formData: SchemaType,
  requireAuth: boolean | undefined
): Promise<ValidationResult<SchemaType>> {
  const requires = typeof requireAuth === "boolean" ? requireAuth : true;

  try {
    const session = await auth();
    if (!session && requires) {
      return {
        success: false,
        status: 401,
        error: "Uautoriseret",
      };
    }
  } catch {
    return {
      success: false,
      status: 401,
      error: "Uautoriseret",
    };
  }

  const parsed = schemaFactory.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      error: "Ugyldige data",
      validationErrors: parsed.error.errors,
    };
  }

  return {
    success: true,
    data: parsed.data as SchemaType,
  };
}
