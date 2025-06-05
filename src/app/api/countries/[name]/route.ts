import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const name = decodeURIComponent(params.name);
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Country not found' }, { status: res.status });
    }
    const data = await res.json();
    const country = data[0];
    const detail = {
      name: country.name?.common ?? name,
      flag: country.flags?.png || '',
      capital: country.capital?.[0] || 'N/A',
      population: country.population,
      region: country.region,
      subregion: country.subregion,
      area: country.area,
      languages: country.languages,
      borders: country.borders,
      currencies: country.currencies,
      timezones: country.timezones,
    };
    return NextResponse.json(detail);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
