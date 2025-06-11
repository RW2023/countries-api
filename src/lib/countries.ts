// src/lib/countries.ts
export type Country = {
    name: string;
    capital: string;
    region: string;
    population: number;
    flag: string;
    languages?: Record<string, string>;
    subregion?: string;
    borders?: string[];
    area?: number;
  };
  
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  
  /** Fetch *all* countries from your internal API */
  export async function getCountries(): Promise<Country[]> {
    const res = await fetch(`${BASE_URL}/api/countries`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  }
  
  /** Fetch **one** country by case-insensitive name */
  export async function getCountryByName(rawName: string): Promise<Country | null> {
    const decoded = decodeURIComponent(rawName).toLowerCase();
    const countries = await getCountries();
    return countries.find((c) => c.name.toLowerCase() === decoded) ?? null;
  }
  