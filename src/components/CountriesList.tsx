"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

interface Country {
    name: string;
    flag: string;
    capital: string;
    population: number;
    region: string;
    languages?: Record<string, string>;
}

const PER_PAGE = 48;
const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function CountriesList() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [filterRegion, setFilterRegion] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("/api/countries")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data: Country[]) => {
                setCountries(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(true);
                setLoading(false);
            });
    }, []);

    const filtered = countries.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = filterRegion ? c.region === filterRegion : true;
        return matchesSearch && matchesRegion;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const start = (page - 1) * PER_PAGE;
    const pageSlice = filtered.slice(start, start + PER_PAGE);

    if (error) {
        return (
            <div className="p-4 text-error text-center font-medium">
                Failed to load countries. Please try again later.
            </div>
        );
    }

    return (
        <section className="space-y-8 min-h-screen">
            {/* drawer toggle */}
            <div className="flex justify-between items-center">
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
                <button
                    className="btn btn-outline ml-4 lg:hidden"
                    onClick={() => setDrawerOpen(true)}
                >
                    <Menu size={18} className="mr-2" /> Filters
                </button>
            </div>

            {/* sidebar filters */}
            <div className={`drawer lg:drawer-open`}>
                <input
                title="Sidebar Drawer Toggle"
                    id="sidebar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    checked={drawerOpen}
                    onChange={(e) => setDrawerOpen(e.target.checked)}
                />
                <div className="drawer-content">
                    {/* animated grid */}
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
                                key={page + search + filterRegion}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {pageSlice.map((country) => (
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
                                                {country.region} &middot; {country.population.toLocaleString()}
                                            </p>
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </AnimatePresence>
                    )}

                    {/* pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`btn btn-sm ${i + 1 === page ? "btn-primary" : "btn-outline"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* drawer side content */}
                <div className="drawer-side z-30">
                    <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                    <aside className="w-80 bg-base-200 text-base-content p-6">
                        <h3 className="text-lg font-semibold mb-4">Filter by Region</h3>
                        <ul className="space-y-2">
                            {regions.map((r) => (
                                <li key={r}>
                                    <button
                                        className={`btn btn-sm w-full justify-start ${r === filterRegion ? "btn-primary" : "btn-outline"
                                            }`}
                                        onClick={() => {
                                            setFilterRegion(r === filterRegion ? null : r);
                                            setPage(1);
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        {r}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </section>
    );
}
