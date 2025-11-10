'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp, Video, FileText } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

interface Offer {
  id: string
  title: string
  description?: string
  type: string
  rewardCoins: number
  provider: string
}

export default function EarnPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [offersRes, balanceRes] = await Promise.all([
        api.get('/offers'),
        api.get('/wallet/balance'),
      ])
      setOffers(offersRes.data)
      setBalance(balanceRes.data.balanceCoins)
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return <FileText className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      default:
        return <TrendingUp className="w-6 h-6" />
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gagner des coins</h1>
              <p className="text-gray-600">Complétez des offres pour gagner de l'argent</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary-600">
                <Coins className="w-8 h-8" />
                {balance.toLocaleString()} coins
              </div>
              <p className="text-sm text-gray-600">≈ {(balance / 1000).toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                    {getIcon(offer.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{offer.title}</h3>
                    <p className="text-sm text-gray-500">{offer.provider}</p>
                  </div>
                </div>
              </div>

              {offer.description && (
                <p className="text-gray-600 mb-4 text-sm">{offer.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-600 font-bold">
                  <Coins className="w-5 h-5" />
                  +{offer.rewardCoins.toLocaleString()} coins
                </div>
                <Button size="sm">Commencer</Button>
              </div>
            </div>
          ))}

          {offers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Aucune offre disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

