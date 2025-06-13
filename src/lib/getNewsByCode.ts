export async function getNewsByCode(code: string): Promise<any[]> {
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.warn("⚠️ GNEWS_API_KEY is missing");
      return [];
    }
  
    const BASE_URL = 'https://gnews.io/api/v4/top-headlines';
    const url = `${BASE_URL}?country=${code.toLowerCase()}&lang=en&token=${API_KEY}`;
  
    const res = await fetch(url);
    const json = await res.json();
  
    return json.articles ?? [];
  }
  