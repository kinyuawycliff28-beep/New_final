'use client'

import { Home, Heart, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/matches', icon: Heart, label: 'Matches' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors',
              pathname === href
                ? 'text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
