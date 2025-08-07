'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  const [manualData, setManualData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    photo_url: ''
  })
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
      
      console.log('Telegram data:', { initData, telegramUser })

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Check if user needs onboarding
        if (!data.user.bio || data.user.bio === 'New user looking to meet amazing people!' || data.user.age === 25) {
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

  const handleManualAuth = async () => {
    setIsLoading(true)
    
    try {
      if (!manualData.first_name) {
        alert('Please enter at least your first name')
        return
      }

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          initData: null,
          manualData: {
            ...manualData,
            id: manualData.id || Math.floor(Math.random() * 1000000).toString()
          }
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/onboard')
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
          <p className="text-gray-600">Find your perfect match</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">Auto Login</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auto" className="space-y-4">
              <Button
                onClick={handleTelegramAuth}
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600"
                size="lg"
              >
                {isLoading ? 'Authenticating...' : 'Continue with Telegram'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                This will try to detect Telegram data automatically
              </p>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={manualData.first_name}
                    onChange={(e) => setManualData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={manualData.last_name}
                    onChange={(e) => setManualData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={manualData.username}
                    onChange={(e) => setManualData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@username (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="telegram_id">Telegram ID</Label>
                  <Input
                    id="telegram_id"
                    value={manualData.id}
                    onChange={(e) => setManualData(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="Your Telegram ID (optional)"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleManualAuth}
                disabled={isLoading || !manualData.first_name}
                className="w-full bg-blue-500 hover:bg-blue-600"
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Enter your details manually to get started
              </p>
            </TabsContent>
          </Tabs>
          
          {/* Development tools */}
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
          
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
