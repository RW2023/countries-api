// app/countries/[code]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CountryDetail from '@/components/CountryDetail';
import { getCountryByCode } from '@/lib/countries';

export default async function Page({
    params,
}: {
    params: { code: string }; // plain object in Next 15
}) {
    const { code } = params;

    // Fetch full country data (summary fields are enough for this view)
    const country = await getCountryByCode(code);

    if (!country) return notFound();

    return (
        <>
            {/* Summary / hero section */}
            <CountryDetail country={country} />

            {/* Deep-dive call-to-action */}
            <div className="flex justify-center mt-8">
                <Link
                    href={`/countries/${country.code}/deep`}
                    className="btn btn-primary"
                >
                    View full deep-dive →
                </Link>
            </div>
        </>
    );
}
