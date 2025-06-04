import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Countries Explorer',
  description: 'Search and explore countries using the REST Countries API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.className} bg-base-100 text-base-content min-h-screen transition-colors`}
      >
        {children}
      </body>
    </html>
  )
}
