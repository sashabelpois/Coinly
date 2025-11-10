'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState(2)
  const [withdrawMethod, setWithdrawMethod] = useState('paypal')

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
        setTransactions([])
        setLoading(false)
        return
      }

      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions'),
      ])
      setBalance(balanceRes.data.balanceCoins)
      setTransactions(transactionsRes.data)
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

  const handleWithdraw = async () => {
    if (balance < withdrawAmount * 1000) {
      toast.error('Solde insuffisant')
      return
    }

    try {
      await api.post('/withdrawals', {
        method: withdrawMethod,
        amountEur: withdrawAmount,
        metadata: {},
      })
      toast.success('Demande de retrait créée')
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
        {/* Balance Card */}
        <div className="bg-slate-800 rounded-3xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-4xl font-bold text-primary-400 mb-2">
              <Coins className="w-10 h-10" />
              {balance.toLocaleString()} coins
            </div>
            <p className="text-2xl text-gray-300">≈ {(balance / 1000).toFixed(2)}€</p>
          </div>
        </div>

        {/* Withdrawal */}
        <div className="bg-slate-800 rounded-3xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Retirer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Montant (€)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={2}
                max={10}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Méthode</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="paypal">PayPal</option>
                <option value="revolut">Revolut</option>
                <option value="giftcard">Carte cadeau</option>
              </select>
            </div>
            <Button onClick={handleWithdraw} className="w-full">
              Retirer
            </Button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Historique</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700 border border-slate-600 rounded-xl">
                <div className="flex items-center gap-3">
                  {tx.amountCoins > 0 ? (
                    <ArrowDownRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="font-medium text-white">{tx.description || tx.type}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${tx.amountCoins > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amountCoins > 0 ? '+' : ''}{tx.amountCoins.toLocaleString()} coins
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-400 py-8">Aucune transaction</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


