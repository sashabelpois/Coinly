'use client'

import { useState } from 'react'
import { X, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  balance: number
  onBalanceUpdate: () => void
}

export function WalletModal({ isOpen, onClose, balance, onBalanceUpdate }: WalletModalProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(2)
  const [withdrawMethod, setWithdrawMethod] = useState('paypal')
  const [showWithdraw, setShowWithdraw] = useState(false)

  const loadTransactions = async () => {
    try {
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        setTransactions([])
        return
      }

      const { data } = await api.get('/wallet/transactions')
      setTransactions(data)
    } catch (error: any) {
      console.error('Error loading transactions:', error)
    }
  }

  const handleWithdraw = async () => {
    if (balance < withdrawAmount * 1000) {
      toast.error('Solde insuffisant')
      return
    }

    setLoading(true)
    try {
      await api.post('/withdrawals', {
        method: withdrawMethod,
        amountEur: withdrawAmount,
        metadata: {},
      })
      toast.success('Demande de retrait créée')
      onBalanceUpdate()
      setShowWithdraw(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Wallet</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Balance */}
        <div className="bg-slate-700 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-4xl font-bold text-primary-400 mb-2">
              <Coins className="w-10 h-10" />
              {balance.toLocaleString()} coins
            </div>
            <p className="text-2xl text-gray-300">≈ {(balance / 1000).toFixed(2)}€</p>
          </div>
        </div>

        {/* Withdraw */}
        {!showWithdraw ? (
          <Button onClick={() => setShowWithdraw(true)} className="w-full mb-6 bg-primary-600 hover:bg-primary-700">
            Retirer
          </Button>
        ) : (
          <div className="bg-slate-700 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Retirer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Montant (€)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="paypal">PayPal</option>
                  <option value="revolut">Revolut</option>
                  <option value="giftcard">Carte cadeau</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowWithdraw(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleWithdraw} disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-700">
                  {loading ? 'Traitement...' : 'Confirmer'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Historique</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
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

