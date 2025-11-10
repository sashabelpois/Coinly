import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp, Gamepad2, Gift } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              HeyCash+
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Inscription</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Gagnez de l'argent réel en ligne
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sondages, offres sponsorisées, vidéos et mini-jeux. 
            Convertissez vos coins en argent réel ou jouez-les pour en gagner plus !
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/earn">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Voir les offres
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <TrendingUp className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Gagnez facilement</h3>
            <p className="text-gray-600">
              Répondez à des sondages, complétez des offres et regardez des vidéos pour gagner des coins.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <Gamepad2 className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Jouez et gagnez</h3>
            <p className="text-gray-600">
              Pile ou face, duels et caisses mystères. Multipliez vos gains en jouant avec vos coins.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <Gift className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Retirez vos gains</h3>
            <p className="text-gray-600">
              PayPal, Revolut ou cartes cadeaux. Retirez dès 2€ avec des paiements rapides.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-20">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 HeyCash+. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

