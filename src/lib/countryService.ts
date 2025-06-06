const isDev = process.env.NODE_ENV === 'development';

export async function getCountries() {
  const url = isDev
    ? 'http://localhost:3000/api/countries'
    : 'https://countriesapi2025.verc/api/countries';

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}
