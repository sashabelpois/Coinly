'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coins, Gamepad2, FileText, Wallet, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { id: 'games', label: 'Games', icon: Gamepad2, href: '/earn?section=games' },
  { id: 'survey', label: 'Survey', icon: FileText, href: '/earn?section=survey' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/earn?section=wallet' },
  { id: 'play', label: 'Jouer', icon: Users, href: '/earn?section=play' },
]

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onWalletClick: () => void
}

export function Sidebar({ activeSection, onSectionChange, onWalletClick }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-800 rounded-3xl p-6 h-fit sticky top-6">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          if (item.id === 'wallet') {
            return (
              <button
                key={item.id}
                onClick={onWalletClick}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

