import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

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
    // Fallback to local data when the remote API is unreachable
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'countries.json');
      const fileData = await readFile(filePath, 'utf-8');
      const data = JSON.parse(fileData);
      return NextResponse.json(data);
    } catch (readErr) {
      return NextResponse.json(
        { error: 'Failed to load countries' },
        { status: 500 }
      );
    }
  }
}
