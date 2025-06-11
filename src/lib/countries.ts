// src/lib/countries.ts

/* ------------------------------------------------------------------ */
/* Country type – extended for deep-dive pages                        */
/* ------------------------------------------------------------------ */
export type Country = {
    /** Common name (e.g. “Canada”) */
    name: string;
    /** 3-letter alpha code (cca3) used for routing (e.g. “CAN”) */
    code: string;
    /** Flag (svg or png URL) */
    flag: string;
  
    /* Geography & Government */
    capital: string;
    region: string;
    subregion?: string;
    borders?: string[];
    area?: number;                     // km²
    independent?: boolean;
    unMember?: boolean;
    car?: { side: string };            // "left" | "right"
  
    /* Demographics */
    population: number;
    languages?: Record<string, string>;
    demonyms?: { eng?: { m: string; f: string } };
  
    /* Economy & Internet */
    currencies?: Record<string, { name: string; symbol: string }>;
    tld?: string[];                    // [".ca"]
    timezones?: string[];              // ["UTC-05:00", …]
  };
  
  /* ------------------------------------------------------------------ */
  /* Internal API helpers                                               */
  /* ------------------------------------------------------------------ */
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  
  /**
   * Fetch *all* countries (lightweight data) from our internal `/api/countries`.
   * This is constrained to ≤10 fields to keep external API happy & list fast.
   */
  export async function getCountries(): Promise<Country[]> {
    const res = await fetch(`${BASE_URL}/api/countries`, { cache: "no-store" });
  
    if (!res.ok) throw new Error("Failed to fetch countries");
  
    return res.json();
  }
  
  /**
   * Case-insensitive lookup by common name – kept for search/autocomplete.
   */
  export async function getCountryByName(
    rawName: string
  ): Promise<Country | null> {
    const decoded = decodeURIComponent(rawName).toLowerCase();
    const countries = await getCountries();
    return countries.find((c) => c.name.toLowerCase() === decoded) ?? null;
  }
  
  /**
   * Fetch **one** country by its 3-letter alpha code (cca3) from REST Countries
   * to obtain the *complete* record for deep-dive pages.
   * This endpoint is not subject to the 10-field limit.
   */
  export async function getCountryByCode(
    rawCode: string
  ): Promise<Country | null> {
    const code = rawCode.toUpperCase();
  
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      console.error("getCountryByCode error:", res.status);
      return null;
    }
  
    const data = await res.json();
    const c = data?.[0];
    if (!c) return null;
  
    /* Map REST Countries response to our Country interface */
    const country: Country = {
      /* Core */
      name: c.name?.common ?? "Unknown",
      code: c.cca3 ?? code,
      flag: c.flags?.svg || c.flags?.png || "",
      capital: c.capital?.[0] ?? "N/A",
      population: c.population ?? 0,
      region: c.region ?? "Unknown",
  
      /* Optional / deep-dive extras */
      languages:  c.languages ?? {},
      subregion:  c.subregion,
      borders:    c.borders ?? [],
      area:       c.area,
      independent: c.independent,
      unMember:    c.unMember,
      car:        c.car,                        // { side: "left" | "right" }
      currencies: c.currencies ?? {},
      tld:        c.tld ?? [],
      timezones:  c.timezones ?? [],
      demonyms:   c.demonyms,
    };
  
    return country;
  }
  