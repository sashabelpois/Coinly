'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

interface CpxOfferwallProps {
  userId: string
  username?: string
  email?: string
  onClose?: () => void
  onConversion?: () => void
}

export function CpxOfferwall({ userId, username, email, onClose, onConversion }: CpxOfferwallProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOfferwallUrl()
    
    // Listen for postback messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // CPX sends postback messages when a survey is completed
      if (event.data && event.data.type === 'cpx_conversion') {
        toast.success('Conversion enregistrée !')
        if (onConversion) {
          onConversion()
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [userId, username, email])

  const loadOfferwallUrl = async () => {
    try {
      setLoading(true)
      
      // Check if we're in mock mode
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        // Generate CPX URL directly for mock users
        const user = JSON.parse(mockUser)
        const params = new URLSearchParams({
          app_id: process.env.NEXT_PUBLIC_CPX_APP_ID || '29900',
          ext_user_id: userId || user.id || 'dev-user-123',
        })
        if (username || user.name) {
          params.append('username', username || user.name)
        }
        if (email || user.email) {
          params.append('email', email || user.email)
        }
        
        const mockUrl = `https://offers.cpx-research.com/index.php?${params.toString()}`
        setIframeUrl(mockUrl)
        setLoading(false)
        return
      }
      
      // Real API call for authenticated users
      const { data } = await api.get(`/offerwalls/CPX/url`)
      setIframeUrl(data.url)
    } catch (error: any) {
      console.error('Error loading CPX offerwall:', error)
      setError(error.response?.data?.message || 'Erreur lors du chargement')
      toast.error('Erreur lors du chargement de l\'offerwall')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-3xl p-8 max-w-4xl w-full">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
            <span className="text-white">Chargement de l'offerwall...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-3xl p-8 max-w-4xl w-full">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={loadOfferwallUrl}>Réessayer</Button>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="ml-2">
                Fermer
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl p-6 max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Sondages CPX Research</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>

        {/* Iframe */}
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden">
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="CPX Research Offerwall"
              allow="payment"
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Complétez les sondages pour gagner des coins. Les récompenses sont créditées automatiquement.</p>
        </div>
      </div>
    </div>
  )
}

