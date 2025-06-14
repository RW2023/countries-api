// app/countries/[code]/deep/page.tsx
// Regenerate this page at most once per day
export const revalidate = 86_400; // 24 h

// ⬆ remove any `export const dynamic = 'force-dynamic'` lines

import { notFound } from "next/navigation";
import CountryDeepDive from "@/components/CountryDeepDive";
import { getCountryByCode } from "@/lib/countries";
import { getNewsByCode } from "@/lib/getNewsByCode";

export default async function DeepPage({
    params,
}: {
    params: { code: string };
}) {
    const country = await getCountryByCode(params.code);
    if (!country) return notFound();

    // country facts can be cached by Next; news bypasses the fetch cache internally
    const news = await getNewsByCode(country.code, country.name);

    return <CountryDeepDive country={country} news={news} />;
}
