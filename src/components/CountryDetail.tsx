// CountryDetail.tsx – navigation fixed + reliable map embed
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

type Props = {
    country: Country;
    /**
     * Optional ordered list (name + code) supplied by the parent page
     * so we can SSR the pagination bar.  Falls back to client fetch.
     */
    allCountries?: Pick<Country, "name" | "code">[];
};

export default function CountryDetail({ country, allCountries = [] }: Props) {
    const router = useRouter();

    /* ------------------------------------------------------------------ */
    /* Alphabetical list of { name, code } objects for prev / next links. */
    /* ------------------------------------------------------------------ */
    const [list, setList] = useState<{ name: string; code: string }[]>(() =>
        allCountries
            .map(({ name, code }) => ({ name, code }))
            .sort((a, b) => a.name.localeCompare(b.name))
    );

    // Lazy-fetch list if not provided by SSR
    useEffect(() => {
        if (list.length) return; // already have
        fetch("/api/countries?fields=name,code")
            .then((r) => (r.ok ? r.json() : []))
            .then(
                (arr: { name: string; code: string }[]) =>
                    setList(
                        arr
                            .map(({ name, code }) => ({ name, code }))
                            .sort((a, b) => a.name.localeCompare(b.name))
                    )
            )
            .catch(() => { });
    }, [list.length]);

    /* ---------------------- prev / next country codes ------------------ */
    const currentIndex = list.findIndex((c) => c.code === country.code);
    const prevCode = currentIndex > 0 ? list[currentIndex - 1]?.code : undefined;
    const nextCode =
        currentIndex !== -1 && currentIndex < list.length - 1
            ? list[currentIndex + 1]?.code
            : undefined;

    /* Keyboard arrows*/
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && prevCode) router.push(`/countries/${prevCode}`);
            if (e.key === "ArrowRight" && nextCode) router.push(`/countries/${nextCode}`);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [prevCode, nextCode, router]);

    /* ----------------------------- Stats ------------------------------ */
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

    /* ----------------------------- Render ----------------------------- */
    return (
        <main className="max-w-4xl mx-auto py-16 px-4 space-y-10">
            {/* navigation bar */}
            <div className="flex justify-between items-center">
                <Link href="/countries" className="btn btn-sm btn-outline">
                    <ArrowLeft size={16} className="mr-1" /> Back
                </Link>
                <div className="flex gap-2">
                    {prevCode && (
                        <Link href={`/countries/${prevCode}`} className="btn btn-sm btn-neutral">
                            <ArrowLeft size={16} />
                        </Link>
                    )}
                    {nextCode && (
                        <Link href={`/countries/${nextCode}`} className="btn btn-sm btn-neutral">
                            <ArrowRight size={16} />
                        </Link>
                    )}
                </div>
            </div>

            {/* title */}
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
                    initial={{ x: -40, opacity: 0 }}
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

                {/* stats */}
                <motion.ul
                    className="space-y-3 text-lg"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {stats.map(({ label, value, icon: Icon }) => (
                        <li key={label} className="flex items-start gap-3">
                            <Icon
                                size={20}
                                className="mt-[3px] text-primary shrink-0"
                                aria-hidden
                            />
                            <span>
                                <strong>{label}:</strong> {value}
                            </span>
                        </li>
                    ))}
                </motion.ul>
            </motion.div>

            {/* Map preview */}
            <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                <iframe
                    title={`${country.name} map`}
                    className="w-full h-64"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        country.name
                    )}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                />
            </div>
        </main>
    );
}
