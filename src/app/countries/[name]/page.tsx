import { notFound } from 'next/navigation';
import CountryDetail from '@/components/CountryDetail';
import { getCountryByName } from '@/lib/countries';

// Next 15 still gives `params` as a Promise
export default async function Page({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const country = await getCountryByName(name);

    if (!country) return notFound();

    return <CountryDetail country={country} />;
}
