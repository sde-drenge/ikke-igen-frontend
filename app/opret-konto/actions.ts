"use server";

import { withDecryptionAndValidation } from "@/plugins/form/validation/with-decryption";
import {
  technicalDataSignupSchema,
  updateProfileSignupSchema,
  verificationsCodeSignupSchema,
} from "./schemas";
import api from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { withValidation } from "@/plugins/form/validation/with-validation";
import { rateLimitByIp } from "@/lib/limiter";
import { jwtVerify, SignJWT } from "jose";
import { environment } from "@/config/environment";
import { LoginError } from "@/lib/errors";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/constants/cookies";
import { unstable_update } from "@/services/auth";

export const technicalDataSignupAction = withDecryptionAndValidation(
  technicalDataSignupSchema,
  async (validatedData) => {
    const { encryptedFields } = validatedData;

    const response = await api.post<User>("/users/signup/", {
      encryptedFields,
      provider: "password",
    });

    const account = response.data;

    const redirectTo =
      ROUTES.SIGNUP + `?uuid=${encodeURIComponent(account.uuid)}`;

    return {
      success: "En bekræftelsesmail er sendt til din emailadresse.",
      status: 200,
      redirect: redirectTo,
    };
  }
);

export const verificationsCodeSignupAction = withValidation(
  verificationsCodeSignupSchema,
  async (validatedData) => {
    const { uuid, verificationCode } = validatedData;

    await rateLimitByIp({
      key: "signup-verificationsCode",
      limit: 3,
      window: 10_000,
    });

    const response = await api.post<User & { jwtToken: string }>(
      `/users/verify-user/${uuid}/`,
      {
        verifyCode: verificationCode,
      }
    );

    const data = response.data;

    let decryptedJwtToken: { user_id: number; token: string };

    try {
      const { payload }: { payload: { user_id: number; token: string } } =
        await jwtVerify(
          data.jwtToken!,
          new TextEncoder().encode(environment.SECRET_KEY),
          {
            algorithms: ["HS256"],
          }
        );
      decryptedJwtToken = payload;
    } catch {
      throw new LoginError();
    }

    const token = await new SignJWT({
      uuid: data.uuid,
      email: data.email,
      isActive: data.isActive,
      user_id: decryptedJwtToken.user_id,
      token: decryptedJwtToken.token,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(environment.SECRET_KEY));

    const awaitedCookies = await cookies();

    awaitedCookies.set({
      name: COOKIES.SESSION_TOKEN.name,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIES.SESSION_TOKEN.maxAge,
      secure: environment.NODE_ENV === "production",
      path: "/",
    });

    const redirectTo =
      ROUTES.SIGNUP + `?uuid=${encodeURIComponent(data.uuid)}&verified=true`;

    return {
      success: "Verifikationskoden er korrekt",
      status: 200,
      redirect: redirectTo,
    };
  },
  {
    requireAuth: false,
  }
);

export const updateProfileSignupAction = withValidation(
  updateProfileSignupSchema,
  async (validatedData) => {
    await rateLimitByIp({
      key: "signup-updateProfile",
      limit: 3,
      window: 10_000,
    });

    const response = await api.patch<User>("/users/update/", validatedData);

    const user = response.data;

    await unstable_update({
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isActive: user.isActive,
        profileColor: user.profileColor,
      },
    });

    return {
      success: "Din konto er blevet oprettet!",
      status: 200,
    };
  }
);
