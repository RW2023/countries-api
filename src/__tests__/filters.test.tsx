import { render, screen, fireEvent } from '@testing-library/react'
import CountriesExplorer from '@/components/CountriesExplorer'
import type { Country } from '@/lib/countries'

const sample: Country[] = [
  {
    name: 'Canada',
    code: 'CAN',
    flag: 'ca.svg',
    capital: 'Ottawa',
    population: 10,
    region: 'Americas',
    languages: { eng: 'English' },
    currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } }
  },
  {
    name: 'France',
    code: 'FRA',
    flag: 'fr.svg',
    capital: 'Paris',
    population: 20,
    region: 'Europe',
    languages: { fra: 'French' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } }
  }
]

test('filters by region', () => {
  render(<CountriesExplorer initialCountries={sample} />)
  fireEvent.click(screen.getByText('Toggle Filters'))
  fireEvent.click(screen.getByLabelText('Europe'))
  expect(screen.getByText('France')).toBeInTheDocument()
  expect(screen.queryByText('Canada')).toBeNull()
})
