"use server";

import { withDecryptionAndValidation } from "@/plugins/form/validation/with-decryption";

import { ROUTES } from "@/lib/constants/routes";
import { signIn } from "@/services/auth";

import { loginSchema } from "./schemas";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/constants/cookies";
import { jwtVerify } from "jose";
import { environment } from "@/config/environment";

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

    const cookiesList = await cookies();
    const sessionCookie = cookiesList.get(COOKIES.SESSION_TOKEN.name);

    if (!result || result?.error || !sessionCookie) {
      return { error: "Forkert email eller adgangskode", status: 401 };
    }

    const { payload } = await jwtVerify<User>(
      sessionCookie.value!,
      new TextEncoder().encode(environment.SECRET_KEY as string),
      {
        algorithms: ["HS256"],
      }
    );

    const redirect =
      payload.role === "teacher" || payload.role === "teacher-admin"
        ? ROUTES.VERIFY_REVIEWS
        : undefined;

    return { success: "Du er nu logget ind", status: 200, redirect };
  }
);
