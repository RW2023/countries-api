'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Country = {
    name: string;
    flag: string;
    capital: string;
    population: number;
    region: string;
    languages?: Record<string, string>;
};

export default function CountriesList() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(false);

    /* fetch once */
    useEffect(() => {
        fetch('/api/countries')
            .then((r) => (r.ok ? r.json() : Promise.reject('fetch failed')))
            .then((data: Country[]) => setCountries(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.error(e);
                setError(true);
            });
    }, []);

    const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (error) {
        return (
            <div className="p-4 text-error text-center font-medium">
                Failed to load countries. Please try again later.
            </div>
        );
    }

    return (
        <section className="space-y-6 min-h-screen transition-colors">
            {/* search */}
            <input
                type="text"
                placeholder="Search for a country…"
                className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* cards */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((country) => (
                    <li
                        key={country.name}
                        className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-[var(--border)] shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        <Link href={`/countries/${encodeURIComponent(country.name.toLowerCase())}`}>
                            <div className="flex flex-col items-center gap-4 text-center p-4 cursor-pointer">
                                <Image
                                    src={country.flag}
                                    alt={country.name}
                                    width={80}
                                    height={56}
                                    className="w-20 h-14 object-cover rounded border border-[var(--border)]"
                                />
                                <h2 className="text-lg font-semibold">{country.name}</h2>

                                <div className="text-sm text-[var(--muted)] space-y-1">
                                    <p>Capital: {country.capital}</p>
                                    <p>Region: {country.region}</p>
                                    <p>Pop: {country.population.toLocaleString()}</p>
                                    {country.languages && (
                                        <p className="text-xs">
                                            Languages: {Object.values(country.languages).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
