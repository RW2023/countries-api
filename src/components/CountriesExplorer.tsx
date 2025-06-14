'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Country } from '@/lib/countries'
import PaginationFloating from './PaginationFloating'
import BackToTopButton from './BackToTopButton'

const REGIONS = [
  'All',
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctic',
  'Polar'
]

const PER_PAGE = 40

export default function CountriesExplorer({ initialCountries = [] }: { initialCountries?: Country[] }) {
  const [countries, setCountries] = useState<Country[]>(initialCountries)
  const [loading, setLoading] = useState(!initialCountries.length)
  const [region, setRegion] = useState('All')
  const [minPop, setMinPop] = useState('')
  const [maxPop, setMaxPop] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [currencies, setCurrencies] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (initialCountries.length) return
    ;(async () => {
      try {
        const res = await fetch('/api/countries', { next: { revalidate: 86_400 } })
        if (!res.ok) throw new Error('fetch failed')
        const data: Country[] = await res.json()
        setCountries(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [initialCountries.length])

  const allLanguages = useMemo(() => {
    const set = new Set<string>()
    countries.forEach(c => Object.values(c.languages || {}).forEach(l => set.add(l)))
    return Array.from(set).sort()
  }, [countries])

  const allCurrencies = useMemo(() => {
    const set = new Set<string>()
    countries.forEach(c => Object.keys(c.currencies || {}).forEach(k => set.add(k)))
    return Array.from(set).sort()
  }, [countries])

  const filtered = useMemo(() => {
    return countries.filter(c => {
      if (region !== 'All' && c.region !== region) return false
      const pop = c.population
      if (minPop && pop < parseInt(minPop, 10)) return false
      if (maxPop && pop > parseInt(maxPop, 10)) return false
      if (languages.length) {
        const langs = Object.values(c.languages || {})
        if (!languages.some(l => langs.includes(l))) return false
      }
      if (currencies.length) {
        const currs = Object.keys(c.currencies || {})
        if (!currencies.some(cur => currs.includes(cur))) return false
      }
      return true
    })
  }, [countries, region, minPop, maxPop, languages, currencies])

  useEffect(() => {
    setPage(1)
  }, [region, minPop, maxPop, languages, currencies])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <section className="space-y-6">
      <button
        onClick={() => setShow(s => !s)}
        className="btn btn-sm"
      >
        Toggle Filters
      </button>
      {show && (
        <div className="space-y-4 border p-4 rounded-md">
          <div className="flex flex-wrap gap-4">
            {REGIONS.map(r => (
              <label key={r} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="region"
                  value={r}
                  checked={region === r}
                  onChange={() => setRegion(r)}
                />
                {r}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min population"
              className="input input-bordered input-sm"
              value={minPop}
              onChange={e => setMinPop(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max population"
              className="input input-bordered input-sm"
              value={maxPop}
              onChange={e => setMaxPop(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              multiple
              className="select select-bordered select-sm"
              value={languages}
              onChange={e =>
                setLanguages(Array.from(e.target.selectedOptions).map(o => o.value))
              }
            >
              {allLanguages.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              multiple
              className="select select-bordered select-sm"
              value={currencies}
              onChange={e =>
                setCurrencies(Array.from(e.target.selectedOptions).map(o => o.value))
              }
            >
              {allCurrencies.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {slice.map(c => (
            <li key={c.code} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow">
              <Link href={`/countries/${c.code}`} className="block p-5 space-y-4 text-center">
                <Image src={c.flag} alt={`${c.name} flag`} width={100} height={68} className="w-24 h-16 object-cover mx-auto rounded border" />
                <h2 className="text-sm font-semibold">{c.name}</h2>
                <p className="text-xs opacity-70">
                  {c.region} · {c.population.toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <PaginationFloating page={page} totalPages={totalPages} onChange={setPage} />
      <BackToTopButton />
    </section>
  )
}
