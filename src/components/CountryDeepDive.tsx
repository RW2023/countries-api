"use client";

import type { ReactNode } from "react";
import { Country } from "@/lib/countries";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * CountryDeepDive – responsive, dark‑mode‑aware detail view.
 * Uses CSS variables defined in globals.css (foreground / background / accent)
 * instead of DaisyUI base colors so light + dark remain consistent.
 */
export default function CountryDeepDive({ country }: { country: Country }) {
    return (
        <motion.section
            className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-[var(--foreground)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold">{country.name}</h1>
                <p className="opacity-70 text-sm tracking-widest uppercase">
                    {country.code}
                </p>
            </motion.div>

            {/* Flag */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={400}
                    height={260}
                    className="mx-auto rounded-xl border border-[var(--foreground)]/20 shadow max-w-full h-auto"
                />
            </motion.div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <InfoCard
                    title="Basics"
                    items={[
                        ["Capital", country.capital],
                        ["Region", regionBadge(country.region)],
                        ["Sub‑region", country.subregion || "—"],
                        ["Population", country.population.toLocaleString()],
                        [
                            "Area",
                            country.area ? `${country.area.toLocaleString()} km²` : "—",
                        ],
                    ]}
                />

                <InfoCard
                    title="Economy"
                    items={[
                        [
                            "Currencies",
                            country.currencies
                                ? Object.values(country.currencies)
                                      .map((c) => `${c.name} (${c.symbol})`)
                                      .join(", ")
                                : "—",
                        ],
                        ["Top‑level domains", country.tld?.join(", ") || "—"],
                    ]}
                />

                <InfoCard
                    title="Time & Transport"
                    items={[
                        ["Time‑zones", country.timezones?.join(", ") || "—"],
                        ["Drives on", country.car?.side || "—"],
                    ]}
                />

                <InfoCard
                    title="Status & Culture"
                    items={[
                        ["Independent", yesNo(country.independent)],
                        ["UN member", yesNo(country.unMember)],
                        [
                            "Demonyms",
                            country.demonyms?.eng
                                ? `${country.demonyms.eng.m} / ${country.demonyms.eng.f}`
                                : "—",
                        ],
                        ["Borders", country.borders?.join(", ") || "—"],
                    ]}
                />
            </div>

            {/* Map */}
            <motion.div
                className="w-full h-72 rounded-xl border border-[var(--foreground)]/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <iframe
                    title={`${country.name} map`}
                    className="w-full h-full"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        country.name
                    )}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                />
            </motion.div>

            {/* Back */}
            <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Link
                    href={`/countries/${country.code}`}
                    className="inline-flex items-center gap-2 border border-[var(--foreground)] px-4 py-2 rounded-full text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
                >
                    <span aria-hidden="true">←</span> Back to summary
                </Link>
            </motion.div>
        </motion.section>
    );
}

/* ---------------------------------- */
/* Helpers                             */
/* ---------------------------------- */
const yesNo = (v?: boolean) => (v == null ? "—" : v ? "Yes" : "No");

// Region badge helper – stylised using CSS vars so colour adapts automatically
function regionBadge(region: string) {
    return `🌍 ${region}`;
}

/* ---------------------------------- */
/* InfoCard sub‑component              */
/* ---------------------------------- */
function InfoCard({
    title,
    items,
}: {
    title: string;
    items: [string, string | ReactNode][];
}) {
    return (
        <motion.div
            className="rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)]/60 dark:bg-[var(--foreground)]/5 p-6 shadow-sm hover:shadow-md transition duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="font-semibold text-lg mb-4">{title}</h2>
            <ul className="space-y-2">
                {items.map(([label, value]) => (
                    <li key={`${title}-${label}`} className="flex justify-between text-sm">
                        <span className="opacity-80">{label}</span>
                        <span className="text-right max-w-[55%] break-words">
                            {value}
                        </span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
