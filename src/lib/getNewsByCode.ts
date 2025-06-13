// lib/getNewsByCode.ts

type NewsCache = {
    [code: string]: {
      articles: any[];
      timestamp: number;
    };
  };
  
  const cache: NewsCache = {};
  const TTL = 1000 * 60 * 30; // 30 minutes
  
  export async function getNewsByCode(code: string, name?: string): Promise<any[]> {
    const now = Date.now();
    const cached = cache[code];
  
    if (cached && now - cached.timestamp < TTL) {
      return cached.articles;
    }
  
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.warn("⚠️ GNEWS_API_KEY is missing. News cannot be fetched.");
      return [];
    }
  
    const BASE_URL = "https://gnews.io/api/v4/top-headlines";
    const COUNTRY_URL = `${BASE_URL}?country=${code.toLowerCase()}&lang=en&token=${API_KEY}`;
    const FALLBACK_URL = `https://gnews.io/api/v4/search?q=${encodeURIComponent(name || code)}&lang=en&token=${API_KEY}`;
  
    try {
      // 🌐 First attempt: fetch using country code
      let res = await fetch(COUNTRY_URL);
      let data = await res.json();
  
      if (!res.ok || !data.articles?.length) {
        console.warn(`🔁 No results for country=${code}, falling back to search "${name || code}"`);
        res = await fetch(FALLBACK_URL);
        data = await res.json();
      }
  
      const articles = data.articles ?? [];
  
      // ✅ Cache result for this code
      cache[code] = {
        articles,
        timestamp: now,
      };
  
      console.log(`✅ News loaded for ${code}: ${articles.length} article(s)`);
      return articles;
    } catch (error) {
      console.error(`❌ Failed to fetch news for ${code}:`, error);
      return [];
    }
  }
  