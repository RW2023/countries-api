import CountriesList from '@/components/CountriesList';

export default function CountriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Explore Countries</h1>
      <CountriesList />
    </main>
  );
}
