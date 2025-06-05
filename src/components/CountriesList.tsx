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

    useEffect(() => {
        fetch('/api/countries')
            .then((res) => res.json())
            .then((data) => setCountries(data));
    }, []);

    const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="space-y-6 min-h-screen">
            <input
                type="text"
                placeholder="Search for a country..."
                className="input input-bordered w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((country) => (
                    <li
                        key={country.name}
                        className="card bg-base-200 p-4 shadow-md hover:bg-base-300 transition"
                    >
                        <Link href={`/countries/${encodeURIComponent(country.name.toLowerCase())}`}>
                            <div className="flex flex-col items-center gap-4 cursor-pointer">
                                <Image
                                    src={country.flag}
                                    alt={country.name}
                                    width={64}
                                    height={48}
                                    className="w-16 h-12 object-cover rounded border"
                                />
                                <h2 className="text-lg font-semibold">{country.name}</h2>
                                <p className="text-sm opacity-70 text-center">
                                    Capital: {country.capital}
                                </p>
                                <p className="text-sm opacity-70 text-center">
                                    Region: {country.region}
                                </p>
                                <p className="text-sm opacity-70 text-center">
                                    Pop: {country.population.toLocaleString()}
                                </p>
                                {country.languages && (
                                    <p className="text-xs mt-1 text-center">
                                        Languages: {Object.values(country.languages).join(', ')}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
