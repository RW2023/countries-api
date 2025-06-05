import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    const simplified = data.map((country: any) => ({
      name: country.name.common,
      flag: country.flags?.png || '',
      capital: country.capital?.[0] || 'N/A',
      population: country.population,
      region: country.region,
      languages: country.languages,
    }));
    return NextResponse.json(simplified);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
