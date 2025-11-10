'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp, Video, FileText, Gamepad2, Star, Clock, ArrowUpDown } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Sidebar } from '@/components/layout/Sidebar'
import { WalletModal } from '@/components/earn/WalletModal'
import { OfferCard } from '@/components/earn/OfferCard'
import { RewardedVideo } from '@/components/earn/RewardedVideo'
import { CpxOfferwall } from '@/components/earn/CpxOfferwall'
import { SyncOffersButton } from '@/components/earn/SyncOffersButton'

interface Offer {
  id: string
  title: string
  description?: string
  type: string
  rewardCoins: number
  provider: string
  rating?: number
  duration?: number
}

export default function EarnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState<Offer[]>([])
  const [games, setGames] = useState<Offer[]>([])
  const [surveys, setSurveys] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [activeSection, setActiveSection] = useState('featured')
  const [walletOpen, setWalletOpen] = useState(false)
  const [cpxOfferwallOpen, setCpxOfferwallOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'reward' | 'rating' | 'duration'>('reward')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [userData, setUserData] = useState<{ id: string; name?: string; email?: string } | null>(null)

  useEffect(() => {
    const section = searchParams.get('section') || 'featured'
    setActiveSection(section)
  }, [searchParams])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const mockUser = localStorage.getItem('mock_user')
    
    if (!token && !mockUser) {
      router.push('/auth/login')
      return
    }

    // Load user data for CPX
    if (mockUser) {
      const user = JSON.parse(mockUser)
      setUserData({
        id: user.id || 'dev-user-123',
        name: user.name,
        email: user.email,
      })
    } else {
      // Load from API
      api.get('/users/profile')
        .then(({ data }) => {
          setUserData({
            id: data.id,
            name: data.name,
            email: data.email,
          })
        })
        .catch(() => {
          // Ignore errors
        })
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        const user = JSON.parse(mockUser)
        setBalance(user.balanceCoins || 10000)
        
        // Try to load real offers first, fallback to mock if fails
        try {
          const [offersRes, balanceRes] = await Promise.all([
            api.get('/offers'),
            api.get('/wallet/balance'),
          ])
          const allOffers = offersRes.data || []
          if (allOffers.length > 0) {
            setOffers(allOffers)
            setGames(allOffers.filter((o: Offer) => o.type === 'game' || o.type === 'offer'))
            setSurveys(allOffers.filter((o: Offer) => o.type === 'survey'))
            setBalance(balanceRes.data?.balanceCoins || user.balanceCoins || 10000)
            setLoading(false)
            return
          }
        } catch (apiError) {
          // Fall through to mock data
        }
        
        // Mock data fallback
        const mockOffers: Offer[] = [
          { id: '1', title: 'Sondage Test', description: 'Sondage de développement', type: 'survey', rewardCoins: 500, provider: 'Test', rating: 4.5, duration: 5 },
          { id: '2', title: 'Jeu Mobile', description: 'Téléchargez et jouez', type: 'game', rewardCoins: 1000, provider: 'Test', rating: 4.8, duration: 10 },
          { id: '3', title: 'Vidéo Pub', description: 'Regardez une vidéo', type: 'video', rewardCoins: 200, provider: 'Test', rating: 4.2, duration: 2 },
        ]
        setOffers(mockOffers)
        setGames(mockOffers.filter(o => o.type === 'game'))
        setSurveys(mockOffers.filter(o => o.type === 'survey'))
        setLoading(false)
        return
      }

      const [offersRes, balanceRes] = await Promise.all([
        api.get('/offers'),
        api.get('/wallet/balance'),
      ])
      const allOffers = offersRes.data || []
      setOffers(allOffers)
      setGames(allOffers.filter((o: Offer) => o.type === 'game' || o.type === 'offer'))
      setSurveys(allOffers.filter((o: Offer) => o.type === 'survey'))
      setBalance(balanceRes.data.balanceCoins || 0)
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login')
      } else {
        console.error('Error loading offers:', error)
        toast.error('Erreur lors du chargement des offres')
        // Set empty arrays on error
        setOffers([])
        setGames([])
        setSurveys([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    router.push(`/earn?section=${section}`, { scroll: false })
  }

  const sortedOffers = (offersList: Offer[]) => {
    const sorted = [...offersList].sort((a, b) => {
      let comparison = 0
      if (sortBy === 'reward') {
        comparison = a.rewardCoins - b.rewardCoins
      } else if (sortBy === 'rating') {
        comparison = (a.rating || 0) - (b.rating || 0)
      } else if (sortBy === 'duration') {
        comparison = (a.duration || 0) - (b.duration || 0)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    return sorted
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return <FileText className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      case 'game':
        return <Gamepad2 className="w-6 h-6" />
      default:
        return <TrendingUp className="w-6 h-6" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            onWalletClick={() => setWalletOpen(true)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-slate-800 rounded-3xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">Gagner des coins</h1>
                  <p className="text-gray-400">Complétez des offres pour gagner de l'argent</p>
                </div>
                <div className="flex items-center gap-4">
                  <SyncOffersButton onSyncComplete={loadData} />
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary-400">
                      <Coins className="w-8 h-8" />
                      {balance.toLocaleString()} coins
                    </div>
                    <p className="text-sm text-gray-400">≈ {(balance / 1000).toFixed(2)}€</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Section */}
            {activeSection === 'featured' && (
              <div className="space-y-8">
                {/* Featured Games */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Featured Games</h2>
                  {games.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {games.slice(0, 3).map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onBalanceUpdate={loadData}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-800 rounded-3xl p-8 text-center">
                      <p className="text-gray-400 mb-4">Aucun jeu disponible pour le moment</p>
                      <p className="text-sm text-gray-500 mb-4">Synchronisez les offres pour voir les jeux disponibles</p>
                      <SyncOffersButton onSyncComplete={loadData} />
                    </div>
                  )}
                </div>

                {/* Featured Surveys */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Featured Survey</h2>
                    <Button
                      onClick={() => setCpxOfferwallOpen(true)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Voir tous les sondages CPX
                    </Button>
                  </div>
                  {surveys.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {surveys.slice(0, 3).map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onBalanceUpdate={loadData}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-800 rounded-3xl p-8 text-center">
                      <p className="text-gray-400 mb-4">Aucun sondage disponible pour le moment</p>
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-500">Synchronisez les offres ou accédez directement aux sondages CPX</p>
                        <div className="flex gap-2">
                          <SyncOffersButton onSyncComplete={loadData} />
                          <Button
                            onClick={() => setCpxOfferwallOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700"
                          >
                            Voir les sondages CPX
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Games Section */}
            {activeSection === 'games' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Games</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'reward' | 'rating' | 'duration')}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="reward">Récompense</option>
                      <option value="rating">Note</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      <ArrowUpDown className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedOffers(games).map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onBalanceUpdate={loadData}
                    />
                  ))}
                  {games.length === 0 && (
                    <div className="col-span-full bg-slate-800 rounded-3xl p-8 text-center">
                      <p className="text-gray-400 mb-4">Aucun jeu disponible</p>
                      <p className="text-sm text-gray-500 mb-4">Synchronisez les offres pour voir les jeux disponibles</p>
                      <SyncOffersButton onSyncComplete={loadData} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Survey Section */}
            {activeSection === 'survey' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Surveys</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'reward' | 'rating' | 'duration')}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="reward">Récompense</option>
                      <option value="rating">Note</option>
                      <option value="duration">Rapidité</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      <ArrowUpDown className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedOffers(surveys).map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onBalanceUpdate={loadData}
                    />
                  ))}
                  {surveys.length === 0 && (
                    <div className="col-span-full bg-slate-800 rounded-3xl p-8 text-center">
                      <p className="text-gray-400 mb-4">Aucun sondage disponible</p>
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-500">Synchronisez les offres ou accédez directement aux sondages CPX</p>
                        <div className="flex gap-2">
                          <SyncOffersButton onSyncComplete={loadData} />
                          <Button
                            onClick={() => setCpxOfferwallOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700"
                          >
                            Voir les sondages CPX
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Play Section (Pile ou Face) */}
            {activeSection === 'play' && (
              <div className="bg-slate-800 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Pile ou Face</h2>
                <p className="text-center text-gray-400 mb-8">
                  Jouez contre d'autres joueurs et multipliez vos gains
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-slate-700 rounded-2xl p-6 mb-6">
                    <p className="text-gray-400 mb-2">Mise minimale</p>
                    <p className="text-2xl font-bold text-white">100 coins</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" className="bg-primary-600 hover:bg-primary-700 px-8">
                      Pile
                    </Button>
                    <Button size="lg" className="bg-primary-600 hover:bg-primary-700 px-8">
                      Face
                    </Button>
                  </div>
                  <p className="text-center text-gray-400 mt-6 text-sm">
                    Fonctionnalité en cours de développement
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        balance={balance}
        onBalanceUpdate={loadData}
      />

      {/* CPX Offerwall */}
      {cpxOfferwallOpen && userData && (
        <CpxOfferwall
          userId={userData.id}
          username={userData.name}
          email={userData.email}
          onClose={() => setCpxOfferwallOpen(false)}
          onConversion={loadData}
        />
      )}
    </div>
  )
}
