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
  const [testResults, setTestResults] = useState<any>(null)
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
      // Try to get Telegram data first
      let initData = window.Telegram?.WebApp?.initData || ''
      let telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user
      
      // If no Telegram data, create mock data for development
      if (!initData && !telegramUser) {
        console.log('No Telegram data found, using mock data for development')
        
        // Create mock initData for development
        const mockTelegramUser = {
          id: Math.floor(Math.random() * 1000000) + 100000,
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          photo_url: null
        }
        
        // Create a simple mock initData string
        initData = `user=${encodeURIComponent(JSON.stringify(mockTelegramUser))}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_hash_for_dev`
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
        if (!data.user.bio || data.user.age === 25) {
          router.push('/onboard')
        } else {
          router.push('/discover')
        }
      } else {
        console.error('Authentication failed:', data.error)
        alert('Authentication failed: ' + data.error)
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(`Database seeded successfully! Created ${data.users} users and ${data.matches} matches.`)
      } else {
        alert('Failed to seed database: ' + data.error)
      }
    } catch (error) {
      console.error('Seed error:', error)
      alert('Failed to seed database')
    } finally {
      setIsLoading(false)
    }
  }

  const testConnections = async () => {
    setIsLoading(true)
    
    try {
      // Test database
      const dbResponse = await fetch('/api/test-db')
      const dbData = await dbResponse.json()
      
      // Test Cloudinary
      const cloudinaryResponse = await fetch('/api/test-cloudinary')
      const cloudinaryData = await cloudinaryResponse.json()
      
      setTestResults({
        database: dbData,
        cloudinary: cloudinaryData
      })
    } catch (error) {
      console.error('Test error:', error)
      setTestResults({
        error: 'Failed to test connections'
      })
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
          
          {/* Development tools */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t pt-4 space-y-2">
              <p className="text-xs text-gray-500 text-center">Development Tools</p>
              
              <Button
                onClick={testConnections}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="sm"
              >
                🔧 Test Database & Cloudinary
              </Button>
              
              <Button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="sm"
              >
                🌱 Seed Database with Mock Data
              </Button>
              
              {testResults && (
                <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                  <div className="mb-1">
                    <strong>Database:</strong> {testResults.database?.success ? '✅ Connected' : '❌ Failed'}
                    {testResults.database?.stats && (
                      <div className="text-gray-600">
                        Users: {testResults.database.stats.users}, 
                        Photos: {testResults.database.stats.photos}, 
                        Matches: {testResults.database.stats.matches}
                      </div>
                    )}
                  </div>
                  <div>
                    <strong>Cloudinary:</strong> {testResults.cloudinary?.success ? '✅ Connected' : '❌ Failed'}
                    {testResults.cloudinary?.cloudName && (
                      <div className="text-gray-600">Cloud: {testResults.cloudinary.cloudName}</div>
                    )}
                  </div>
                </div>
              )}
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
