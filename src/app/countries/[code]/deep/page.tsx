import { notFound } from 'next/navigation';
import CountryDeepDive from '@/components/CountryDeepDive';
import { getCountryByCode } from '@/lib/countries';
import { getNewsByCode } from '@/lib/getNewsByCode'; // 🔥 NEW

export default async function DeepPage({ params }: { params: { code: string } }) {
    const country = await getCountryByCode(params.code);
    if (!country) return notFound();

    const news = await getNewsByCode(country.code); // ✅ direct call

    return <CountryDeepDive country={country} news={news} />;
}
