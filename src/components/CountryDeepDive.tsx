// components/CountryDeepDive.tsx
"use client";
import { Country } from "@/lib/countries";
import Image from "next/image";
import Link from "next/link";

export default function CountryDeepDive({ country }: { country: Country }) {
    return (
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">{country.name}</h1>
                <p className="opacity-70">{country.code}</p>
            </div>

            {/* Flag */}
            <Image
                src={country.flag}
                alt={`${country.name} flag`}
                width={400}
                height={260}
                className="mx-auto rounded-xl border shadow"
            />

            {/* Section grids */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* 🧾 Basics */}
                <InfoCard
                    title="Basics"
                    items={[
                        ["Capital", country.capital],
                        ["Region", country.region],
                        ["Sub-region", country.subregion || "—"],
                        ["Population", country.population.toLocaleString()],
                        [
                            "Area",
                            country.area ? `${country.area.toLocaleString()} km²` : "—",
                        ],
                    ]}
                />

                {/* 💰 Economy */}
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
                        ["Top-level domains", country.tld?.join(", ") || "—"],
                    ]}
                />

                {/* 🕒 Time & Driving */}
                <InfoCard
                    title="Time & Transport"
                    items={[
                        ["Time-zones", country.timezones?.join(", ") || "—"],
                        ["Drives on", country.car?.side || "—"],
                    ]}
                />

                {/* 🌐 Misc */}
                <InfoCard
                    title="Status & Culture"
                    items={[
                        ["Independent", country.independent ? "Yes" : "No"],
                        ["UN member", country.unMember ? "Yes" : "No"],
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
            <iframe
                title={`${country.name} map`}
                className="w-full h-72 rounded-xl border"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    country.name
                )}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
            />

            {/* Back to summary */}
            <div className="flex justify-center">
                <Link
                    href={`/countries/${country.code}`}
                    className="btn btn-outline mt-6 flex items-center gap-2"
                >
                    <span aria-hidden="true">←</span> Back to summary
                </Link>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Reusable info card                                                 */
/* ------------------------------------------------------------------ */
function InfoCard({
    title,
    items,
}: {
    title: string;
    items: [string, string][];
}) {
    return (
        <div className="bg-base-200 rounded-box p-5 shadow space-y-1">
            <h2 className="font-semibold text-lg mb-2">{title}</h2>
            <ul className="space-y-1">
                {items.map(([label, value]) => (
                    <li key={label}>
                        <strong>{label}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}
