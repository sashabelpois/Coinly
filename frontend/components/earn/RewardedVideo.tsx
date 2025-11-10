'use client'

import { useState, useRef, useEffect } from 'react'
import { Coins, Play, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { toast } from 'sonner'

interface RewardedVideoProps {
  rewardCoins: number
  onComplete?: () => void
}

export function RewardedVideo({ rewardCoins, onComplete }: RewardedVideoProps) {
  const [isWatching, setIsWatching] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [timeWatched, setTimeWatched] = useState(0)
  const [requiredTime, setRequiredTime] = useState(30) // 30 seconds minimum

  const handleStart = () => {
    setIsWatching(true)
    // In production, this would load a real video ad (e.g., Google AdMob, Unity Ads)
    // For now, we'll simulate with a placeholder
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleComplete = async () => {
    if (timeWatched < requiredTime) {
      toast.error(`Vous devez regarder au moins ${requiredTime} secondes`)
      return
    }

    try {
      // In production, this would be called by the ad SDK
      await api.post('/offers/video/complete', {
        rewardCoins,
        duration: timeWatched,
      })
      
      setIsCompleted(true)
      toast.success(`+${rewardCoins.toLocaleString()} coins crédités !`)
      
      if (onComplete) {
        onComplete()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du crédit')
    }
  }

  useEffect(() => {
    if (isWatching && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused) {
          setTimeWatched((prev) => {
            const newTime = prev + 1
            if (newTime >= requiredTime && !isCompleted) {
              handleComplete()
            }
            return newTime
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isWatching, isCompleted])

  if (isCompleted) {
    return (
      <div className="bg-slate-800 rounded-3xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Vidéo terminée !</h3>
        <div className="flex items-center justify-center gap-2 text-primary-400 font-bold text-lg">
          <Coins className="w-6 h-6" />
          +{rewardCoins.toLocaleString()} coins crédités
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-3xl p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Vidéo rémunérée</h3>
        <div className="flex items-center justify-center gap-2 text-primary-400 font-bold">
          <Coins className="w-5 h-5" />
          +{rewardCoins.toLocaleString()} coins
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Regardez au moins {requiredTime} secondes pour gagner
        </p>
      </div>

      {!isWatching ? (
        <Button
          onClick={handleStart}
          className="w-full bg-primary-600 hover:bg-primary-700"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Regarder la vidéo
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-4 aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full rounded-xl"
              src="/api/video-placeholder" // Placeholder - in production, use real ad video
              onEnded={handleComplete}
            >
              <div className="text-center text-gray-400">
                <p>Vidéo publicitaire</p>
                <p className="text-sm mt-2">Temps regardé: {timeWatched}s / {requiredTime}s</p>
              </div>
            </video>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Temps regardé: {timeWatched}s</span>
            <span>Minimum: {requiredTime}s</span>
          </div>
          {timeWatched >= requiredTime && (
            <Button
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Terminer et gagner
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

