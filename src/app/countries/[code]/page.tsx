// app/countries/[code]/page.tsx
import { notFound } from 'next/navigation';
import CountryDetail from '@/components/CountryDetail';
import { getCountryByCode } from '@/lib/countries';

/**
 * Dynamic deep-dive page for a single country, addressed by its 3-letter alpha code (e.g. “USA”, “CAN”).
 *
 * Route example:  /countries/USA
 */
export default async function Page({
    params,
}: {
    params: { code: string }; // <-- plain object in Next 15
}) {
    const { code } = params;

    // Fetch full country data
    const country = await getCountryByCode(code);

    if (!country) return notFound();

    return <CountryDetail country={country} />;
}
