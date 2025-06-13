// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';

type NewsCache = {
  [code: string]: { articles: any[]; timestamp: number };
};

const cache: NewsCache = {};
const TTL = 1000 * 60 * 30; // 30 minutes
const API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toLowerCase();
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const now = Date.now();
  const cached = cache[code];

  if (cached && now - cached.timestamp < TTL) {
    return NextResponse.json(cached.articles);
  }

  try {
    const url = `${BASE_URL}?country=${code}&lang=en&token=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data.articles) {
      return NextResponse.json({ error: 'Error fetching news' }, { status: 502 });
    }

    cache[code] = { articles: data.articles, timestamp: now };
    return NextResponse.json(data.articles);
  } catch (err) {
    return NextResponse.json({ error: 'Network error', detail: err }, { status: 500 });
  }
}
