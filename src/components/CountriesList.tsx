// CountriesList.tsx – search + region filter + pagination + transitions (no sidebar filters)
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PaginationFloating from "./PaginationFloating";
import BackToTopButton from "./BackToTopButton";

/** The shape returned by /api/countries */
interface Country {
    /** Common name (e.g. "Canada") */
    name: string;
    /** ISO‑3166 alpha‑3 code (e.g. "CAN") */
    code: string;
    flag: string;
    capital: string;
    population: number;
    region: Region;
    languages?: Record<string, string>;
}

/**
 * Add a sentinel "All" so the select can clear the region filter
 * without breaking type‑safety.
 */
type Region =
    | "Africa"
    | "Americas"
    | "Asia"
    | "Europe"
    | "Oceania"
    | "Antarctic"
    | "Polar"
    | "All";

const REGIONS: Region[] = [
    "All",
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctic",
    "Polar",
];

const PER_PAGE = 48;

export default function CountriesList() {
    /*────────────────────────── state */
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState<Region>("All");
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

    /*── Derived list after search + region filter ────────*/
    const filtered = useMemo(() => {
        return countries.filter((c) => {
            const matchesRegion = region === "All" || c.region === region;
            const matchesSearch = c.name
                .toLowerCase()
                .includes(search.toLowerCase());
            return matchesRegion && matchesSearch;
        });
    }, [countries, search, region]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
    const start = (page - 1) * PER_PAGE;
    const pageSlice = filtered.slice(start, start + PER_PAGE);

    /* Reset page whenever the filters change */
    useEffect(() => {
        setPage(1);
    }, [search, region]);

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
            {/* ── controls (search + region) ───────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Search */}
                <label className="form-control w-full sm:w-1/2">
                    <span className="label-text mb-1">Search</span>
                    <input
                        type="text"
                        placeholder="Search for a country…"
                        className="input input-bordered w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>

                {/* Region */}
                <label className="form-control w-full sm:w-40">
                    <span className="label-text mb-1">Region</span>
                    <select
                        className="select select-bordered"
                        value={region}
                        onChange={(e) => setRegion(e.target.value as Region)}
                    >
                        {REGIONS.map((r) => (
                            <option key={r} value={r}>
                                {r === "All" ? "All regions" : r}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* ── grid ─────────────────────────────────────── */}
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
                        key={`${page}-${search}-${region}`}
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
                                    <h2 className="text-lg font-semibold">
                                        {country.name}
                                    </h2>
                                    <p className="text-sm opacity-70">
                                        {country.region} &middot; {country.population.toLocaleString()}
                                    </p>
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            )}

            {/* ── pagination ───────────────────────────────── */}
            <PaginationFloating
                page={page}
                totalPages={totalPages}
                onChange={(newPage) => setPage(newPage)}
            />

            {/* ── back‑to‑top (mobile only) ────────────────── */}
            <BackToTopButton />
        </section>
    );
}
