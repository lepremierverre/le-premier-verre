import { NextResponse } from "next/server";

import { searchSanity } from "@/lib/search/server-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim() ?? "";
  const locale = searchParams.get("locale") === "en" ? "en" : "fr";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const results = await searchSanity(q, locale, 20);

  return NextResponse.json(results);
}
