'use client'

import { useState } from 'react'
import { Coins, Star, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

interface OfferCardProps {
  offer: {
    id: string
    title: string
    description?: string
    type: string
    rewardCoins: number
    provider: string
    rating?: number
    duration?: number
  }
  onBalanceUpdate?: () => void
}

export function OfferCard({ offer, onBalanceUpdate }: OfferCardProps) {
  const [loading, setLoading] = useState(false)

  const handleStartOffer = async () => {
    setLoading(true)
    try {
      // Get offerwall URL
      const { data } = await api.get(`/offerwalls/${offer.provider}/url/${offer.id}`)
      
      // Open offerwall in new window
      const offerWindow = window.open(
        data.url,
        'offerwall',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for postback (in real implementation, this would be handled by the postback endpoint)
      // For now, we'll just show a message
      toast.success('Offre ouverte dans une nouvelle fenêtre')
      
      // Poll for conversion (simplified - in production, use WebSockets or polling)
      if (offerWindow) {
        const checkInterval = setInterval(async () => {
          try {
            const balanceRes = await api.get('/wallet/balance')
            if (onBalanceUpdate) {
              onBalanceUpdate()
            }
          } catch (error) {
            // Ignore
          }
        }, 5000)

        // Clear interval when window closes
        const closeCheck = setInterval(() => {
          if (offerWindow.closed) {
            clearInterval(checkInterval)
            clearInterval(closeCheck)
          }
        }, 1000)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ouverture de l\'offre')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return '📋'
      case 'video':
        return '🎥'
      case 'game':
        return '🎮'
      default:
        return '🎁'
    }
  }

  return (
    <div className="bg-slate-800 rounded-3xl p-6 shadow-lg hover:bg-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-600/20 rounded-2xl text-2xl">
            {getIcon(offer.type)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{offer.title}</h3>
            <p className="text-sm text-gray-400">{offer.provider}</p>
          </div>
        </div>
      </div>

      {offer.description && (
        <p className="text-gray-400 mb-4 text-sm">{offer.description}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        {offer.rating && (
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{offer.rating}</span>
          </div>
        )}
        {offer.duration && (
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{offer.duration} min</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-400 font-bold">
          <Coins className="w-5 h-5" />
          +{offer.rewardCoins.toLocaleString()} coins
        </div>
        <Button
          size="sm"
          className="bg-primary-600 hover:bg-primary-700"
          onClick={handleStartOffer}
          disabled={loading}
        >
          {loading ? 'Ouverture...' : (
            <>
              Commencer
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

