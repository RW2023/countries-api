// lib/getNewsByCode.ts
type NewsCache = {
    [code: string]: { articles: any[]; timestamp: number };
  };
  
  const cache: NewsCache = {};
  const TTL = 1_000 * 60 * 30; // 30 min
  
  export async function getNewsByCode(code: string, name?: string) {
    const now = Date.now();
    const cached = cache[code];
    if (cached && now - cached.timestamp < TTL) return cached.articles;
  
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.warn("⚠️ GNEWS_API_KEY missing");
      return [];
    }
  
    const countryURL =
      `https://gnews.io/api/v4/top-headlines?country=${code.toLowerCase()}&lang=en&token=${API_KEY}`;
    const fallbackURL =
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(name || code)}&lang=en&token=${API_KEY}`;
  
    try {
      // ── first try the country endpoint ──
      let res = await fetch(countryURL, { cache: "no-store" });
      let data = await res.json();
  
      // ── fallback to keyword search if no results ──
      if (!data.articles?.length) {
        console.warn(`🔁 No results for country=${code}. Fallback to query.`);
        res = await fetch(fallbackURL, { cache: "no-store" });
        data = await res.json();
      }
  
      const articles = data.articles ?? [];
      cache[code] = { articles, timestamp: now };
      return articles;
    } catch (err) {
      console.error("❌ GNews fetch failed:", err);
      return [];
    }
  }
  