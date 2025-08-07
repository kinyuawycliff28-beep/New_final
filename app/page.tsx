'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: any
        initData?: string
        ready?: () => void
      }
    }
  }
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.()
    }
  }, [])

  const handleTelegramAuth = async () => {
    setIsLoading(true)
    
    try {
      const initData = window.Telegram?.WebApp?.initData || ''
      
      if (!initData) {
        alert('Please open this app through Telegram')
        return
      }

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Check if user needs onboarding
        if (!data.user.bio || data.user.age === 18) {
          router.push('/onboard')
        } else {
          router.push('/discover')
        }
      } else {
        alert('Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-pink-600 mb-2">
            💕 TeleDate
          </CardTitle>
          <p className="text-gray-600">Find your perfect match through Telegram</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleTelegramAuth}
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600"
            size="lg"
          >
            {isLoading ? 'Authenticating...' : 'Continue with Telegram'}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
