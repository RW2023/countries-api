import CountriesExplorer from '@/components/CountriesExplorer'

export default function ExploreCountriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-6 text-center">Advanced Explorer</h1>
      <CountriesExplorer />
    </main>
  )
}
