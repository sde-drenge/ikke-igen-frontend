"use server";

import { withDecryptionAndValidation } from "@/plugins/form/validation/with-decryption";

import { ROUTES } from "@/lib/constants/routes";
import { signIn } from "@/services/auth";

import { loginSchema } from "./schemas";

type SerializedUnverifiedError = {
  name: "UnverifiedError";
  message: string;
  uuid: string;
  error: string;
};

function isSerializedUnverifiedError(
  obj: unknown
): obj is SerializedUnverifiedError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "uuid" in obj &&
    "error" in obj &&
    "message" in obj &&
    (obj as Record<string, unknown>).name === "UnverifiedError" &&
    typeof (obj as Record<string, unknown>).uuid === "string" &&
    typeof (obj as Record<string, unknown>).error === "string" &&
    typeof (obj as Record<string, unknown>).message === "string"
  );
}

export const loginAction = withDecryptionAndValidation(
  loginSchema,
  async (validatedData) => {
    const { email, encryptedFields } = validatedData;

    let result;

    try {
      result = await signIn("credentials", {
        encryptedFields,
        redirect: false,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "cause" in error &&
        typeof error.cause === "object" &&
        error.cause !== null &&
        "err" in error.cause &&
        isSerializedUnverifiedError((error.cause as { err: unknown }).err)
      ) {
        const err = (error.cause as { err: SerializedUnverifiedError }).err;

        const redirect =
          ROUTES.SIGNUP +
          `?uuid=${encodeURIComponent(err.uuid)}&email=${encodeURIComponent(
            email
          )}`;

        return {
          success: "Du er næsten der, venligst bekræft din e-mailadresse",
          status: 200,
          redirect,
          data: {
            verified: false,
          },
        };
      }

      return {
        error: "Forkert email eller adgangskode",
        status: 401,
      };
    }

    if (!result || result?.error) {
      return { error: "Forkert email eller adgangskode", status: 401 };
    }

    return { success: "Du er nu logget ind", status: 200 };
  }
);
