import { NextResponse } from 'next/server';

type Country = {
  name: string;
  code: string;
  flag: string;
  capital: string;
  population: number;
  region: string;
  languages?: Record<string, string>;
};

export async function GET() {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,population,region,languages',
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch error response:', res.status, text);
      throw new Error('Failed to fetch countries');
    }

    const data = await res.json();

    const countries: Country[] = data.map((country: any) => ({
      name: country.name?.common || 'Unknown',
      code: country.cca3 || 'N/A',
      flag: country.flags?.svg || country.flags?.png || '',
      capital: country.capital?.[0] || 'N/A',
      population: country.population ?? 0,
      region: country.region || 'Unknown',
      languages: country.languages || {},
    }));

    return NextResponse.json(countries);
  } catch (err) {
    console.error('API error in /api/countries:', err);

    const fallback: Country[] = [
      {
        name: 'Canada',
        code: 'CAN',
        flag: 'https://flagcdn.com/ca.svg',
        capital: 'Ottawa',
        population: 38000000,
        region: 'Americas',
        languages: { eng: 'English', fra: 'French' },
      },
    ];

    return NextResponse.json(fallback, { status: 200 });
  }
}
