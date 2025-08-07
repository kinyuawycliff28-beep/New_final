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
        expand?: () => void
      }
    }
  }
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [telegramData, setTelegramData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.()
      window.Telegram.WebApp.expand?.()
      
      const initData = window.Telegram.WebApp.initData
      const user = window.Telegram.WebApp.initDataUnsafe?.user
      
      if (user) {
        setTelegramData({ initData, user })
      }
    }
  }, [])

  const handleTelegramAuth = async () => {
    setIsLoading(true)
    
    try {
      if (!telegramData?.initData) {
        throw new Error('No Telegram data available. Please open this app through Telegram.')
      }

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          initData: telegramData.initData,
          user: telegramData.user 
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Check if user needs onboarding
        if (data.isNewUser || !data.user.bio || data.user.age === 25) {
          router.push('/onboard')
        } else {
          router.push('/discover')
        }
      } else {
        throw new Error(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert(error instanceof Error ? error.message : 'Authentication failed')
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
        <CardContent className="space-y-6">
          {telegramData?.user ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Welcome, {telegramData.user.first_name}!
                </p>
                <p className="text-green-600 text-sm">
                  Telegram authentication detected
                </p>
              </div>
              
              <Button
                onClick={handleTelegramAuth}
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600"
                size="lg"
              >
                {isLoading ? 'Authenticating...' : 'Continue to App'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  Telegram Required
                </p>
                <p className="text-blue-600 text-sm">
                  This app must be opened through Telegram
                </p>
              </div>
              
              <div className="text-xs text-gray-500 space-y-2">
                <p>To use this app:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Open Telegram</li>
                  <li>Find @YourBotName</li>
                  <li>Click "Open Web App"</li>
                </ol>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
