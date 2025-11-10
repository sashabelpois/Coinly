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
    if (!token) {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 mb-2">Utilisateurs</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 mb-2">Retraits</p>
              <p className="text-3xl font-bold">{stats.totalWithdrawals}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 mb-2">Conversions</p>
              <p className="text-3xl font-bold">{stats.totalConversions}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 mb-2">Revenus (coins)</p>
              <p className="text-3xl font-bold">{stats.totalRevenueCoins?.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Retraits en attente</h2>
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-xl">
                <div>
                  <p className="font-medium">{withdrawal.user.email}</p>
                  <p className="text-sm text-gray-500">
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
              <p className="text-center text-gray-500 py-8">Aucun retrait en attente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


