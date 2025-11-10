'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Coins, Package } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Case {
  id: string
  name: string
  description?: string
  costCoins: number
}

export default function GamesPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'coinflip' | 'cases'>('coinflip')
  const [coinflipChoice, setCoinflipChoice] = useState<'heads' | 'tails' | null>(null)
  const [coinflipBet, setCoinflipBet] = useState(100)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const mockUser = localStorage.getItem('mock_user')
    
    // Permettre l'accès si connecté ou en mode mock
    if (!token && !mockUser) {
      router.push('/auth/login')
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      // Vérifier si on est en mode mock
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        const user = JSON.parse(mockUser)
        setBalance(user.balanceCoins || 10000)
        setCases([
          {
            id: '1',
            name: 'Bronze Case',
            description: 'Basic rewards case',
            costCoins: 1000,
          },
          {
            id: '2',
            name: 'Silver Case',
            description: 'Better rewards case',
            costCoins: 2500,
          },
        ])
        setLoading(false)
        return
      }

      const [balanceRes, casesRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/games/cases'),
      ])
      setBalance(balanceRes.data.balanceCoins)
      setCases(casesRes.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login')
      } else {
        toast.error('Erreur lors du chargement')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCoinflip = async (choice: 'heads' | 'tails') => {
    if (balance < coinflipBet) {
      toast.error('Solde insuffisant')
      return
    }

    setCoinflipChoice(choice)
    setFlipping(true)

    try {
      const { data } = await api.post('/games/coinflip', {
        betCoins: coinflipBet,
        choice,
      })

      setTimeout(() => {
        setFlipping(false)
        const result = data.result as any
        if (result.won) {
          toast.success(`Gagné ! +${coinflipBet * 2} coins`)
        } else {
          toast.error('Perdu !')
        }
        loadData()
      }, 2000)
    } catch (error: any) {
      setFlipping(false)
      toast.error(error.response?.data?.message || 'Erreur')
    }
  }

  const handleOpenCase = async (caseId: string) => {
    try {
      const { data } = await api.post('/games/cases/open', { caseId })
      toast.success('Caisse ouverte !')
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-slate-800 rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Jeux</h1>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary-400">
              <Coins className="w-8 h-8" />
              {balance.toLocaleString()} coins
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'coinflip' ? 'default' : 'outline'}
            onClick={() => setActiveTab('coinflip')}
          >
            Pile ou Face
          </Button>
          <Button
            variant={activeTab === 'cases' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cases')}
          >
            Caisses
          </Button>
        </div>

        {/* Coinflip */}
        {activeTab === 'coinflip' && (
          <div className="bg-slate-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Pile ou Face</h2>

            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-300">Mise (coins)</label>
                <input
                  type="number"
                  value={coinflipBet}
                  onChange={(e) => setCoinflipBet(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={1}
                  max={balance}
                />
              </div>

              <div className="flex gap-4 justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCoinflip('heads')}
                  disabled={flipping || balance < coinflipBet}
                  className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
                >
                  Pile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCoinflip('tails')}
                  disabled={flipping || balance < coinflipBet}
                  className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
                >
                  Face
                </motion.button>
              </div>

              {flipping && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-center text-6xl mb-4"
                >
                  🪙
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Cases */}
        {activeTab === 'cases' && (
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="bg-slate-800 rounded-3xl p-6 shadow-lg hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary-600/20 rounded-2xl">
                    <Package className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{caseItem.name}</h3>
                    {caseItem.description && (
                      <p className="text-sm text-gray-400">{caseItem.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary-400 font-bold">
                    <Coins className="w-5 h-5 inline mr-1" />
                    {caseItem.costCoins.toLocaleString()} coins
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleOpenCase(caseItem.id)}
                  disabled={balance < caseItem.costCoins}
                >
                  Ouvrir
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


