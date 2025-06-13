// lib/getNewsByCode.ts

type NewsCache = {
    [code: string]: {
      articles: any[];
      timestamp: number;
    };
  };
  
  const cache: NewsCache = {};
  const TTL = 1000 * 60 * 30; // 30 minutes
  
  export async function getNewsByCode(code: string): Promise<any[]> {
    const now = Date.now();
    const cached = cache[code];
  
    // ✅ Use country-specific cache
    if (cached && now - cached.timestamp < TTL) {
      return cached.articles;
    }
  
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.warn("⚠️ Missing GNEWS_API_KEY in environment.");
      return [];
    }
  
    const BASE_URL = "https://gnews.io/api/v4/top-headlines";
    const url = `${BASE_URL}?country=${code.toLowerCase()}&lang=en&token=${API_KEY}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (!res.ok || !data.articles) {
        console.error("❌ GNews fetch error:", data);
        return [];
      }
  
      const articles = data.articles ?? [];
  
      // ✅ Save in per-country cache
      cache[code] = {
        articles,
        timestamp: now,
      };
  
      return articles;
    } catch (error) {
      console.error("❌ GNews network error:", error);
      return [];
    }
  }
  