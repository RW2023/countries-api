'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

    useEffect(() => {
        fetch('/api/countries')
            .then((r) => (r.ok ? r.json() : Promise.reject('fetch failed')))
            .then((data: Country[]) => setCountries(Array.isArray(data) ? data : []))
            .catch(() => setError(true));
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
        <section className="space-y-8 min-h-screen">
            <input
                type="text"
                placeholder="Search for a country…"
                className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filtered.map((country) => (
                    <motion.li
                        key={country.name}
                        whileHover={{ y: -6 }}
                        className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-[var(--border)] shadow-md"
                    >
                        <Link
                            href={`/countries/${encodeURIComponent(
                                country.name.toLowerCase()
                            )}`}
                            className="block p-5 space-y-4 text-center"
                        >
                            <Image
                                src={country.flag}
                                alt={country.name}
                                width={100}
                                height={68}
                                className="w-24 h-16 object-cover mx-auto rounded border border-[var(--border)]"
                            />
                            <h2 className="text-lg font-semibold">{country.name}</h2>
                            <p className="text-sm opacity-70">
                                {country.region} &middot;{' '}
                                {country.population.toLocaleString()}
                            </p>
                        </Link>
                    </motion.li>
                ))}
            </ul>
        </section>
    );
}
