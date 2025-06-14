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
    name: string; // common name, e.g. “Canada”
    code: string; // alpha‑3 code for routing
    flag: string;
    capital: string;
    population: number;
    region: Region;
    languages?: Record<string, string>;
}

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
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState<Region>("All");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);

    /*── Fetch all countries ──────────────────────────────*/
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/countries", { next: { revalidate: 86_400 } });
                if (!res.ok) throw new Error();
                const data: Country[] = await res.json();
                setCountries(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /*── Derived list (search + region) ───────────────────*/
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return countries.filter((c) => {
            const regionMatch = region === "All" || c.region === region;
            const searchMatch =
                !term ||
                c.name.toLowerCase().includes(term) ||
                c.capital.toLowerCase().includes(term);
            return regionMatch && searchMatch;
        });
    }, [countries, search, region]);

    /* snap to first page when filter changes */
    useEffect(() => {
        setPage(1);
    }, [search, region]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    if (error) {
        return (
            <div className="p-4 text-error font-medium text-center">
                Failed to load countries. Please try again later.
            </div>
        );
    }

    return (
        <section className="space-y-8 min-h-screen">
            {/* ── controls ─────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 w-full max-w-4xl">
                {/* search */}
                <input
                    type="text"
                    placeholder="Search for a country…"
                    className="w-full md:flex-1 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* region filter */}
                <select
                    title="Filter by region"
                    className="w-full md:w-44 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                >
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>
                            {r === "All" ? "All regions" : r}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── grid ─────────────────────────────────────── */}
            {loading ? (
                <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Array.from({ length: PER_PAGE }).map((_, i) => (
                        <li
                            key={i}
                            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4 animate-pulse"
                        >
                            {/* flag stub */}
                            <div className="h-16 w-24 mx-auto rounded bg-[var(--foreground)] opacity-10" />
                            {/* title stub */}
                            <div className="h-4 w-3/4 mx-auto rounded bg-[var(--foreground)] opacity-10" />
                            {/* subtitle stub */}
                            <div className="h-3 w-1/2 mx-auto rounded bg-[var(--foreground)] opacity-10" />
                        </li>
                    ))}
                </ul>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.ul
                        key={`${search}-${region}-${page}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
                    >
                        {slice.map((c) => (
                            <motion.li
                                key={c.code}
                                whileHover={{ y: -6 }}
                                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:shadow-lg transition"
                            >
                                <Link
                                    href={`/countries/${c.code}`}
                                    className="block p-5 space-y-4 text-center"
                                >
                                    <Image
                                        src={c.flag}
                                        alt={`${c.name} flag`}
                                        width={100}
                                        height={68}
                                        className="w-24 h-16 object-cover mx-auto rounded border border-[var(--border)]"
                                    />
                                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                                        {c.name}
                                    </h2>
                                    <p className="text-xs opacity-70 text-[var(--foreground)]">
                                        {c.region} &middot; {c.population.toLocaleString()}
                                    </p>
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            )}

            {/* ── pagination ───────────────────────────────── */}
            <PaginationFloating page={page} totalPages={totalPages} onChange={setPage} />
            <BackToTopButton />
        </section>
    );
}
