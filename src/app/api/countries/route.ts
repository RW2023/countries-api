// app/api/countries/route.ts
import { NextResponse } from 'next/server';
import type { Country } from '@/lib/countries';

// ≤ 10 fields to satisfy the API limit
const FIELDS =
  'name,cca3,flags,capital,population,region,languages,subregion';

export async function GET() {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/all?fields=${FIELDS}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch error response:', res.status, text);
      throw new Error('Failed to fetch countries');
    }

    const raw = await res.json();

    const countries: Country[] = raw.map((c: any) => ({
      /* core */
      name:  c.name?.common ?? 'Unknown',
      code:  c.cca3 ?? 'N/A',
      flag:  c.flags?.svg || c.flags?.png || '',
      capital: c.capital?.[0] ?? 'N/A',
      population: c.population ?? 0,
      region: c.region ?? 'Unknown',

      /* light extras (optional) */
      languages:  c.languages ?? {},
      subregion:  c.subregion,
    }));

    return NextResponse.json(countries);
  } catch (err) {
    console.error('API error in /api/countries:', err);

    // lightweight fallback
    return NextResponse.json(
      [
        {
          name: 'Canada',
          code: 'CAN',
          flag: 'https://flagcdn.com/ca.svg',
          capital: 'Ottawa',
          population: 38_000_000,
          region: 'Americas',
          languages: { eng: 'English', fra: 'French' },
        },
      ],
      { status: 200 }
    );
  }
}
