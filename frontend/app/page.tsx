import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp, Gamepad2, Gift, FileText, Video, CheckCircle, Puzzle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary-400" />
            <span className="text-2xl font-bold text-white">
              Coinly
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/earn" className="text-white hover:text-primary-400 transition-colors">
              Earn
            </Link>
            <Link href="/games" className="text-white hover:text-primary-400 transition-colors">
              Games
            </Link>
            <Link href="/wallet" className="text-white hover:text-primary-400 transition-colors">
              Wallet
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-slate-800">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Hero Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Earn Money Online
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Make money by completing surveys, watching videos, playing games, and more.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white text-lg px-8 py-6 rounded-2xl">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-600/20 rounded-2xl">
                    <FileText className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Surveys</h3>
                    <p className="text-gray-400">Get paid for sharing your opinion</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-600/20 rounded-2xl">
                    <Video className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Videos</h3>
                    <p className="text-gray-400">Watch videos and receive rewards</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-600/20 rounded-2xl">
                    <CheckCircle className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Offers</h3>
                    <p className="text-gray-400">Complete various tasks and earn</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-600/20 rounded-2xl">
                    <Puzzle className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Extension</h3>
                    <p className="text-gray-400">Redeem your coins in our browser add-on</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Your Coins Card */}
            <div className="bg-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Coins</h2>
              <div className="text-4xl font-bold text-white mb-4">3,200</div>
              <div className="h-16 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl flex items-end p-2">
                <div className="w-full h-8 bg-primary-500 rounded-lg opacity-80" style={{
                  clipPath: 'polygon(0% 100%, 5% 80%, 10% 90%, 15% 70%, 20% 85%, 25% 60%, 30% 75%, 35% 55%, 40% 70%, 45% 50%, 50% 65%, 55% 45%, 60% 60%, 65% 40%, 70% 55%, 75% 35%, 80% 50%, 85% 30%, 90% 45%, 95% 25%, 100% 40%, 100% 100%)'
                }}></div>
              </div>
            </div>

            {/* CoinFlip Card */}
            <div className="bg-slate-800 rounded-3xl p-6 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-white">CoinFlip</h2>
                <div className="p-2 bg-primary-600/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              <p className="text-gray-400">Play for a chance to win more</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-700 mt-20">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Coinly. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
