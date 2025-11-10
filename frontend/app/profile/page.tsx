'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const mockUser = localStorage.getItem('mock_user')
    
    // Permettre l'accès si connecté ou en mode mock
    if (!token && !mockUser) {
      router.push('/auth/login')
      return
    }

    loadProfile()
  }, [router])

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/users/profile')
      setProfile(data)
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
        <div className="bg-slate-800 rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Profil</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Nom</label>
              <input
                type="text"
                value={profile?.name || ''}
                disabled
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Pays</label>
              <input
                type="text"
                value={profile?.country || ''}
                disabled
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Statut KYC</label>
              <input
                type="text"
                value={profile?.kycStatus || 'pending'}
                disabled
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


