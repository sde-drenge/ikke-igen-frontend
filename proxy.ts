import { NextRequest, NextResponse } from "next/server";
import { auth } from "./services/auth";

const authMiddleware = auth(async () => {
  return NextResponse.next();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function proxy(request: NextRequest, event: any) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return authMiddleware(request, event);
  }

  return NextResponse.next();
}

export const config = {
  // match everything except:
  //  - _next (Next.js internals)
  //  - _vercel (Vercel internals)
  //  - any file with an extension (static assets)
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
