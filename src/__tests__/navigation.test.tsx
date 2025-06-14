import { render, screen } from '@testing-library/react'
import CountriesPage from '@/app/countries/page'

test('Explore Countries title links to advanced explorer', () => {
  render(<CountriesPage />)
  const link = screen.getByRole('link', { name: /explore countries/i })
  expect(link).toHaveAttribute('href', '/explore-countries')
})
