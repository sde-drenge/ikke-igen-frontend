import api, { safeGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { shapeError } from "@/plugins/form/validation/utils";
import { auth } from "@/services/auth";
import { NextResponse } from "next/server";

function redirect(
  req: Request,
  path: string,
  searchParams?: Record<string, string>
) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";

  const url = new URL(`${proto}://${host}`);
  url.pathname = path;

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return NextResponse.redirect(url, 307);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const [session, { uuid }] = await Promise.all([auth(), params]);

  if (!session) {
    return redirect(req, ROUTES.LOGIN, {
      redirect: req.url,
      error: "Du skal være logget ind for at acceptere invitationen.",
    });
  }

  const { error } = await safeGet(`/schools/${uuid}/is-teacher/`);
  if (!error) {
    return redirect(req, ROUTES.VERIFY_REVIEWS);
  } // Already a teacher, redirect to verify reviews page

  try {
    await api.post(`/schools/${uuid}/accept/`);

    return redirect(req, ROUTES.VERIFY_REVIEWS, {
      success:
        "Du har nu accepteret invitationen og er blevet tilføjet som lærer.",
    });
  } catch (error) {
    const { error: errorMessage } = shapeError(error);

    return redirect(req, ROUTES.FRONTPAGE, {
      error: errorMessage,
    });
  }
}
