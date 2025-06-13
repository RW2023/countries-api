// CountriesList.tsx – simple search + pagination + transitions (no sidebar filters)
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PaginationFloating from "./PaginationFloating";
import BackToTopButton from "./BackToTopButton";

interface Country {
    /** Common name (e.g. “Canada”) */
    name: string;
    /** 3-letter alpha code used for routing (e.g. “CAN”) */
    code: string;
    flag: string;
    capital: string;
    population: number;
    region: string;
    languages?: Record<string, string>;
}

const PER_PAGE = 48;

export default function CountriesList() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);

    /*── Fetch all countries ──────────────────────────────*/
    useEffect(() => {
        setLoading(true);
        fetch("/api/countries")
            .then((r) => (r.ok ? r.json() : Promise.reject("fetch failed")))
            .then((data: Country[]) => {
                setCountries(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    /*── Derived lists ────────────────────────────────────*/
    const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
    const start = (page - 1) * PER_PAGE;
    const pageSlice = filtered.slice(start, start + PER_PAGE);

    /*── Error fallback ───────────────────────────────────*/
    if (error) {
        return (
            <div className="p-4 text-error text-center font-medium">
                Failed to load countries. Please try again later.
            </div>
        );
    }

    return (
        <section className="space-y-8 min-h-screen">
            {/* ── search box ─────────────────────────────────── */}
            <input
                type="text"
                placeholder="Search for a country…"
                className="w-full max-w-md px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            {/* ── grid ───────────────────────────────────────── */}
            {loading ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <li
                            key={i}
                            className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 animate-pulse"
                        >
                            <div className="w-20 h-14 bg-gray-300 dark:bg-gray-700 rounded mb-4 mx-auto" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                        </li>
                    ))}
                </ul>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.ul
                        key={page + search}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {pageSlice.map((country) => (
                            <motion.li
                                key={country.code}
                                whileHover={{ y: -6 }}
                                className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-[var(--border)] shadow-md"
                            >
                                <Link
                                    href={`/countries/${country.code}`}
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
                                        {country.region} &middot;{" "}
                                        {country.population.toLocaleString()}
                                    </p>
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            )}

            {/* ── pagination ─────────────────────────────────── */}
            <PaginationFloating
                page={page}
                totalPages={totalPages}
                onChange={(newPage) => setPage(newPage)}
            />
            <BackToTopButton />


        </section>
    );
}
