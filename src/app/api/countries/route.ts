import { NextResponse } from 'next/server';

type Country = {
  name: string;
  flag: string;
  capital: string;
  population: number;
  region: string;
  languages?: Record<string, string>;
};

export async function GET() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    if (!res.ok) throw new Error('Failed to fetch countries');

    const data = await res.json();

    const countries: Country[] = data.map((country: any) => ({
      name: country.name?.common || 'Unknown',
      flag: country.flags?.svg || country.flags?.png || '',
      capital: country.capital?.[0] || 'N/A',
      population: country.population || 0,
      region: country.region || 'Unknown',
      languages: country.languages || {},
    }));

    return NextResponse.json(countries); // ✅ Return a clean array
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
