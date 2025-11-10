import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { DevAuthButton } from '@/components/dev/DevAuthButton'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coinly - Gagnez de l\'argent en ligne',
  description: 'Plateforme moderne pour gagner de l\'argent réel via des sondages, offres et mini-jeux',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Toaster position="top-right" />
          <DevAuthButton />
        </Providers>
      </body>
    </html>
  )
}


