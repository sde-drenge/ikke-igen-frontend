import { NextRequest, NextResponse } from "next/server";

import api from "@/lib/api";
import { rateLimitByIp } from "@/lib/limiter";

export const GET = async (req: NextRequest) => {
  await rateLimitByIp({
    key: "search-education",
    limit: 10,
    window: 10_000, // 10 requests per 10 seconds
  });

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Query parameter "search" is required' },
        { status: 400 }
      );
    }

    const response = await api.get(
      `/schools/education-types/find/?search=${searchQuery}`
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
