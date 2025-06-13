// app/api/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNewsByCode } from "@/lib/getNewsByCode";

/**
 * GET /api/news?code=US&name=United%20States
 *
 *  • `code` (required) – ISO-3166 alpha-2 or alpha-3 country code
 *  • `name` (optional) – human-readable country name for keyword fallback
 *
 * The route returns an array of articles already cached per country
 * inside getNewsByCode(), so it’s edge-friendly.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toLowerCase();
  const name = req.nextUrl.searchParams.get("name") ?? undefined;

  if (!code) {
    return NextResponse.json(
      { error: "Missing `code` query parameter" },
      { status: 400 }
    );
  }

  try {
    const articles = await getNewsByCode(code, name);
    return NextResponse.json(articles);
  } catch (err) {
    console.error("❌ /api/news error:", err);
    return NextResponse.json(
      { error: "Internal error fetching news" },
      { status: 500 }
    );
  }
}
