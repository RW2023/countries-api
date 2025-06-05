// app/countries/[name]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Country = {
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

export const dynamic = 'force-dynamic'; // enable runtime rendering

export default async function CountryPage({ params }: { params: { name: string } }) {
    const { name } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/countries`);
    const allCountries: Country[] = await res.json();

    const country = allCountries.find(
        (c) => c.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
    );

    if (!country) return notFound();

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-4xl font-bold text-center">{country.name}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={240}
                    height={160}
                    className="rounded border"
                />
                <div className="space-y-2">
                    <p><strong>Capital:</strong> {country.capital}</p>
                    <p><strong>Region:</strong> {country.region}</p>
                    <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                    {country.languages && (
                        <p><strong>Languages:</strong> {Object.values(country.languages).join(', ')}</p>
                    )}
                    {country.subregion && <p><strong>Subregion:</strong> {country.subregion}</p>}
                    {country.area && <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>}
                    {country.borders?.length && (
                        <p><strong>Borders:</strong> {country.borders.join(', ')}</p>
                    )}
                </div>
            </div>
        </main>
    );
}
