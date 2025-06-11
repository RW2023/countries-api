'use client';

import Image from 'next/image';
import { Country } from '@/lib/countries';

type Props = { country: Country };

export default function CountryDetail({ country }: Props) {
    return (
        <main className="max-w-4xl mx-auto py-10 px-4 space-y-6 text-gray-900 dark:text-gray-100">
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
