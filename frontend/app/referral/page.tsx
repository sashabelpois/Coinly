'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Coins, Users } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function ReferralPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    loadStats()
    // Generate referral code from user ID (simplified)
    const userId = localStorage.getItem('userId')
    if (userId) {
      setReferralCode(btoa(userId).substring(0, 8).toUpperCase())
    }
  }, [router])

  const loadStats = async () => {
    try {
      const { data } = await api.get('/referrals/stats')
      setStats(data)
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

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth/register?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    toast.success('Lien copié !')
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
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Parrainage</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-primary-600" />
                <h2 className="text-xl font-bold">Parrainés</h2>
              </div>
              <p className="text-4xl font-bold text-primary-600">
                {stats?.totalReferrals || 0}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-8 h-8 text-purple-600" />
                <h2 className="text-xl font-bold">Gains totaux</h2>
              </div>
              <p className="text-4xl font-bold text-purple-600">
                {stats?.totalEarned?.toLocaleString() || 0} coins
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Votre lien de parrainage</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${referralCode}`}
                readOnly
                className="flex-1 px-4 py-2 border rounded-xl bg-white"
              />
              <Button onClick={copyReferralLink}>Copier</Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Gagnez 5% à vie sur tous les gains de vos parrainés (plafonné à 100€)
            </p>
          </div>

          {stats?.referrals && stats.referrals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Vos parrainés</h2>
              <div className="space-y-2">
                {stats.referrals.map((ref: any) => (
                  <div key={ref.id} className="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <p className="font-medium">{ref.referee.email}</p>
                      <p className="text-sm text-gray-500">
                        Inscrit le {new Date(ref.referee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">
                        {ref.lifetimeEarned.toLocaleString()} coins
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


