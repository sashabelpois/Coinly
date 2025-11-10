'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Coins, Menu, X, LogOut, User, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/lib/api'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const mockUser = localStorage.getItem('mock_user')
    setIsLoggedIn(!!(token || mockUser))

    if (token || mockUser) {
      loadBalance()
    }
  }, [pathname])

  const loadBalance = async () => {
    try {
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        const user = JSON.parse(mockUser)
        setBalance(user.balanceCoins || 10000)
        return
      }

      const { data } = await api.get('/wallet/balance')
      setBalance(data.balanceCoins)
    } catch (error) {
      // Ignore errors
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('mock_user')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    toast.success('Déconnexion réussie')
    router.push('/')
  }

  const navItems = [
    { href: '/earn', label: 'Earn' },
  ]

  // Ne pas afficher sur les pages d'auth
  if (pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Coinly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Balance */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl">
                  <Coins className="w-5 h-5 text-primary-400" />
                  <span className="text-sm font-bold text-white">
                    {balance.toLocaleString()} coins
                  </span>
                </div>

                {/* Profile Menu */}
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-400 hover:text-white"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isLoggedIn && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <Coins className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-bold text-white">
                  {balance.toLocaleString()} coins
                </span>
              </div>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


