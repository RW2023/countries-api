import { notFound } from 'next/navigation';
import CountryDeepDive from '@/components/CountryDeepDive';
import { getCountryByCode } from '@/lib/countries';

export default async function DeepPage({
    params,
}: {
    params: { code: string };
}) {
    const country = await getCountryByCode(params.code);
    if (!country) return notFound();

    return <CountryDeepDive country={country} />;
}
