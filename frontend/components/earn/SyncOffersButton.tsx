'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

interface SyncOffersButtonProps {
  onSyncComplete?: () => void
}

export function SyncOffersButton({ onSyncComplete }: SyncOffersButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/offerwalls/sync')
      toast.success(`Synchronisation réussie: ${data.cpx?.synced || 0} offres CPX`)
      if (onSyncComplete) {
        onSyncComplete()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la synchronisation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-slate-600 hover:bg-slate-700"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Synchronisation...' : 'Synchroniser les offres'}
    </Button>
  )
}

