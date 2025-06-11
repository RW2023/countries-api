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

/**
 * CountryDetail – summary view with navigation + map preview.
 * Now aligned with deep-dive button spacing & style (mt-8 mb-4).
 */
export default function CountryDetail({
    country,
    allCountries = [],
}: {
    country: Country;
    allCountries?: Pick<Country, "name" | "code">[];
}) {
    const router = useRouter();

    /* -------------------------------- list for prev/next ------------------------------- */
    const [list, setList] = useState<{ name: string; code: string }[]>(() =>
        allCountries
            .map(({ name, code }) => ({ name, code }))
            .sort((a, b) => a.name.localeCompare(b.name))
    );

    // Fetch list client-side if not provided
    useEffect(() => {
        if (list.length) return;
        fetch("/api/countries?fields=name,code")
            .then((r) => (r.ok ? r.json() : []))
            .then((arr: { name: string; code: string }[]) =>
                setList(arr.sort((a, b) => a.name.localeCompare(b.name)))
            )
            .catch(() => {});
    }, [list.length]);

    const currentIndex = list.findIndex((c) => c.code === country.code);
    const prevCode = currentIndex > 0 ? list[currentIndex - 1]?.code : undefined;
    const nextCode = currentIndex !== -1 && currentIndex < list.length - 1 ? list[currentIndex + 1]?.code : undefined;

    /* ------------------------------- keyboard nav -------------------------------------- */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && prevCode) router.push(`/countries/${prevCode}`);
            if (e.key === "ArrowRight" && nextCode) router.push(`/countries/${nextCode}`);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [prevCode, nextCode, router]);

    /* ------------------------------------- stats --------------------------------------- */
    const stats = useMemo(() => {
        return (
            [
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
                    label: "Sub-region",
                    value: country.subregion,
                    icon: Globe2,
                },
                country.area && {
                    label: "Area",
                    value: `${country.area.toLocaleString()} km²`,
                    icon: Globe2,
                },
                Array.isArray(country.borders) &&
                    country.borders.length > 0 && {
                        label: "Borders",
                        value: country.borders.join(", "),
                        icon: Globe2,
                    },
            ].filter(Boolean) as { label: string; value: string; icon: React.ElementType }[]
        );
    }, [country]);

    /* ----------------------------------- render ---------------------------------------- */
    return (
        <main className="max-w-4xl mx-auto py-16 pb-24 px-4 space-y-10 text-[var(--foreground)]">
            {/* nav bar */}
            <div className="flex justify-between items-center">
                <Link href="/countries" className="inline-flex items-center gap-2 border border-[var(--foreground)] px-3 py-1.5 rounded text-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] transition">
                    <ArrowLeft size={16} /> Back
                </Link>
                <div className="flex gap-2">
                    {prevCode && (
                        <Link href={`/countries/${prevCode}`} className="inline-flex items-center border border-[var(--foreground)] p-1.5 rounded hover:bg-[var(--foreground)] hover:text-[var(--background)] transition">
                            <ArrowLeft size={16} />
                        </Link>
                    )}
                    {nextCode && (
                        <Link href={`/countries/${nextCode}`} className="inline-flex items-center border border-[var(--foreground)] p-1.5 rounded hover:bg-[var(--foreground)] hover:text-[var(--background)] transition">
                            <ArrowRight size={16} />
                        </Link>
                    )}
                </div>
            </div>

            {/* title */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold">{country.name}</h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
            </div>

            {/* flag + stats */}
            <motion.div
                className="flex flex-col sm:flex-row items-center gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="rounded-xl border border-[var(--foreground)]/20 shadow overflow-hidden"
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

                <motion.ul
                    className="space-y-3 text-lg"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {stats.map(({ label, value, icon: Icon }) => (
                        <li key={label} className="flex items-start gap-3">
                            <Icon size={20} className="mt-[3px] text-[var(--primary)] shrink-0" aria-hidden />
                            <span>
                                <strong>{label}:</strong> {value}
                            </span>
                        </li>
                    ))}
                </motion.ul>
            </motion.div>

            {/* Map preview */}
            <div className="rounded-xl overflow-hidden border border-[var(--foreground)]/20">
                <iframe
                    title={`${country.name} map`}
                    className="w-full h-64"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(country.name)}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                />
            </div>

            {/* deep-dive button */}
            <div className="flex justify-center mt-8 mb-4">
                <Link
                    href={`/countries/${country.code}/deep`}
                    className="inline-flex items-center gap-2 border border-[var(--foreground)] px-4 py-2 rounded-full text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
                >
                    View full deep-dive →
                </Link>
            </div>
        </main>
    );
}