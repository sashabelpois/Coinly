'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      const [statsRes, withdrawalsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/withdrawals?status=pending'),
      ])
      setStats(statsRes.data)
      setWithdrawals(withdrawalsRes.data)
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

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/approve`)
      toast.success('Retrait approuvé')
      loadData()
    } catch (error: any) {
      toast.error('Erreur')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/reject`)
      toast.success('Retrait rejeté')
      loadData()
    } catch (error: any) {
      toast.error('Erreur')
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
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Admin</h1>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
              <p className="text-gray-400 mb-2">Utilisateurs</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
              <p className="text-gray-400 mb-2">Retraits</p>
              <p className="text-3xl font-bold text-white">{stats.totalWithdrawals}</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
              <p className="text-gray-400 mb-2">Conversions</p>
              <p className="text-3xl font-bold text-white">{stats.totalConversions}</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
              <p className="text-gray-400 mb-2">Revenus (coins)</p>
              <p className="text-3xl font-bold text-white">{stats.totalRevenueCoins?.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Pending Withdrawals */}
        <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Retraits en attente</h2>
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-slate-700 border border-slate-600 rounded-xl">
                <div>
                  <p className="font-medium text-white">{withdrawal.user.email}</p>
                  <p className="text-sm text-gray-400">
                    {withdrawal.amountEur}€ via {withdrawal.method}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(withdrawal.id)}
                  >
                    Rejeter
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(withdrawal.id)}
                  >
                    Approuver
                  </Button>
                </div>
              </div>
            ))}
            {withdrawals.length === 0 && (
              <p className="text-center text-gray-400 py-8">Aucun retrait en attente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


