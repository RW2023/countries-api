// src/lib/countries.ts

export type Country = {
    /** Common name (e.g. “Canada”) */
    name: string;
    /** 3-letter alpha code (e.g. “CAN”, “USA”) – used for routing */
    code: string;
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
  
  /**
   * Fetch *all* countries from the internal `/api/countries` route.
   * The API already returns the `code` property (added earlier).
   */
  export async function getCountries(): Promise<Country[]> {
    const res = await fetch(`${BASE_URL}/api/countries`, { cache: 'no-store' });
  
    if (!res.ok) throw new Error('Failed to fetch countries');
  
    return res.json();
  }
  
  /**
   * Fetch **one** country by a case-insensitive name match.
   * Kept for backwards compatibility (e.g. search/autocomplete).
   */
  export async function getCountryByName(rawName: string): Promise<Country | null> {
    const decoded = decodeURIComponent(rawName).toLowerCase();
    const countries = await getCountries();
    return countries.find((c) => c.name.toLowerCase() === decoded) ?? null;
  }
  
  /**
   * Fetch **one** country by its 3-letter alpha code (cca3).
   * This is now the preferred helper for the deep-dive route.
   */
  export async function getCountryByCode(rawCode: string): Promise<Country | null> {
    const code = rawCode.toUpperCase();
    const countries = await getCountries();
    return countries.find((c) => c.code.toUpperCase() === code) ?? null;
  }
  