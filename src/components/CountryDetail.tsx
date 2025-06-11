// CountryDetail.tsx – now with inline navigation (prev / next / back)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Country } from "@/lib/countries";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Globe2,
    Users,
    Languages,
} from "lucide-react";

type Props = { country: Country };

export default function CountryDetail({ country }: Props) {
    /* ─────── Fetch all country names for prev/next nav ─────── */
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/countries")
            .then((r) => (r.ok ? r.json() : Promise.reject("fetch failed")))
            .then((data: Country[]) => setNames(data.map((c) => c.name)))
            .catch(() => setNames([]));
    }, []);

    // Memo‑calculate prev / next based on alphabetic list
    const { prev, next } = useMemo(() => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        const idx = sorted.findIndex((n) => n === country.name);
        return {
            prev: idx > 0 ? sorted[idx - 1] : null,
            next: idx !== -1 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
        };
    }, [names, country.name]);

    /* ─────── Stats helper array ─────── */
    const stats = [
        { label: "Capital", value: country.capital, icon: MapPin },
        { label: "Region", value: country.region, icon: Globe2 },
        {
            label: "Population",
            value: country.population.toLocaleString(),
            icon: Users,
        },
        country.languages && {
            label: "Languages",
            value: Object.values(country.languages).join(", "),
            icon: Languages,
        },
        country.subregion && {
            label: "Sub‑region",
            value: country.subregion,
            icon: Globe2,
        },
        country.area && {
            label: "Area",
            value: `${country.area.toLocaleString()} km²`,
            icon: Globe2,
        },
        Array.isArray(country.borders) && country.borders.length > 0 && {
            label: "Borders",
            value: country.borders.join(", "),
            icon: Globe2,
        },
    ].filter(Boolean) as { label: string; value: string; icon: React.ElementType }[];

    const router = useRouter();

    return (
        <main className="max-w-4xl mx-auto py-16 px-4 space-y-14">
            {/* top nav bar */}
            <div className="flex items-center justify-between text-sm md:text-base">
                {prev ? (
                    <Link
                        href={`/countries/${encodeURIComponent(prev.toLowerCase())}`}
                        className="inline-flex items-center gap-1 hover:underline"
                    >
                        <ArrowLeft size={16} /> {prev}
                    </Link>
                ) : (
                    <span />
                )}

                <button
                    onClick={() => router.push("/countries")}
                    className="btn btn-ghost px-3 py-1 rounded-full text-xs md:text-sm"
                >
                    Back to list
                </button>

                {next ? (
                    <Link
                        href={`/countries/${encodeURIComponent(next.toLowerCase())}`}
                        className="inline-flex items-center gap-1 hover:underline"
                    >
                        {next} <ArrowRight size={16} />
                    </Link>
                ) : (
                    <span />
                )}
            </div>

            {/* title + accent bar */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold">{country.name}</h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>

            {/* flag + facts */}
            <motion.div
                className="flex flex-col sm:flex-row items-center gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* flag */}
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="rounded-xl border border-[var(--border)] shadow-lg overflow-hidden"
                >
                    <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        width={340}
                        height={220}
                        className="w-[340px] h-[220px] object-cover"
                        priority
                    />
                </motion.div>

                {/* fact list */}
                <motion.ul
                    className="space-y-3 text-lg"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {stats.map(({ label, value, icon: Icon }) => (
                        <li key={label} className="flex items-start gap-3">
                            <Icon size={20} className="mt-[3px] text-primary shrink-0" aria-hidden />
                            <span>
                                <strong>{label}:</strong> {value}
                            </span>
                        </li>
                    ))}
                </motion.ul>
            </motion.div>
        </main>
    );
}
