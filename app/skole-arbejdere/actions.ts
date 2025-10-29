"use server";

import { withValidation } from "@/plugins/form/validation/with-validation";

import api from "@/lib/api";

import { inviteTeacherSchema, kickTeacherSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants/routes";
import { rateLimitByIp } from "@/lib/limiter";

export const inviteTeacherAction = withValidation(
  inviteTeacherSchema,
  async (validatedData) => {
    const { email } = validatedData;

    await rateLimitByIp({ key: "invite", limit: 3, window: 10_000 });

    await api.post(`/schools/add-teacher/`, {
      email,
    });

    return {
      success: `Du har nu inviteret ${email}`,
      status: 200,
    };
  }
);

export const kickTeacherAction = withValidation(
  kickTeacherSchema,
  async (validatedData) => {
    const { name, uuid: teacherUuid } = validatedData;

    await api.delete(`/schools/teachers/${teacherUuid}/remove/`);

    revalidatePath(ROUTES.SCHOOL_WORKERS, "page");

    return { status: 200, success: name + " er blevet smidt ud." };
  }
);
