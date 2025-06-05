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
        <section className="space-y-6 min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-4 py-8 transition-colors duration-300">
            <input
                type="text"
                placeholder="Search for a country..."
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((country) => (
                    <li
                        key={country.name}
                        className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Link href={`/countries/${encodeURIComponent(country.name.toLowerCase())}`}>
                            <div className="flex flex-col items-center gap-4 cursor-pointer">
                                <Image
                                    src={country.flag}
                                    alt={country.name}
                                    width={64}
                                    height={48}
                                    className="w-16 h-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                                />
                                <h2 className="text-lg font-semibold">{country.name}</h2>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                                    Capital: {country.capital}
                                </p>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                                    Region: {country.region}
                                </p>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                                    Pop: {country.population.toLocaleString()}
                                </p>
                                {country.languages && (
                                    <p className="text-xs mt-1 text-center text-gray-500 dark:text-gray-400">
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
