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
    if (!token) {
      router.push('/auth/login')
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-4xl font-bold text-primary-600 mb-2">
              <Coins className="w-10 h-10" />
              {balance.toLocaleString()} coins
            </div>
            <p className="text-2xl text-gray-600">≈ {(balance / 1000).toFixed(2)}€</p>
          </div>
        </div>

        {/* Withdrawal */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Retirer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Montant (€)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-xl"
                min={2}
                max={10}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Méthode</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
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
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Historique</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-xl">
                <div className="flex items-center gap-3">
                  {tx.amountCoins > 0 ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{tx.description || tx.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${tx.amountCoins > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amountCoins > 0 ? '+' : ''}{tx.amountCoins.toLocaleString()} coins
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucune transaction</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


