'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function DevAuthButton() {
  const router = useRouter()
  const [isDevMode, setIsDevMode] = useState(false)
  const [isMockLoggedIn, setIsMockLoggedIn] = useState(false)

  useEffect(() => {
    // Vérifier si on est en mode développement
    setIsDevMode(process.env.NODE_ENV === 'development')
    
    // Vérifier si un mock user est déjà connecté
    const mockUser = localStorage.getItem('mock_user')
    setIsMockLoggedIn(!!mockUser)
  }, [])

  const handleMockLogin = () => {
    // Créer un mock user et token
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@coinly.test',
      name: 'Dev User',
      balanceCoins: 10000,
    }
    
    const mockToken = 'mock-jwt-token-dev-12345'
    
    localStorage.setItem('mock_user', JSON.stringify(mockUser))
    localStorage.setItem('token', mockToken)
    
    setIsMockLoggedIn(true)
    router.push('/earn?section=featured')
  }

  const handleMockLogout = () => {
    localStorage.removeItem('mock_user')
    localStorage.removeItem('token')
    setIsMockLoggedIn(false)
    window.location.reload()
  }

  // Ne pas afficher en production
  if (!isDevMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-yellow-800">DEV MODE</span>
        </div>
        {isMockLoggedIn ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <User className="w-4 h-4" />
              <span>Connecté (Mock)</span>
            </div>
            <Button
              onClick={handleMockLogout}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Déconnexion Mock
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleMockLogin}
            size="sm"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
          >
            <User className="w-3 h-3 mr-1" />
            Connexion Mock
          </Button>
        )}
      </div>
    </div>
  )
}

