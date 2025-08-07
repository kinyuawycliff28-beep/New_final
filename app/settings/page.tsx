'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Shield, Heart, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    notifications: true,
    showLocation: true,
    showOnline: true,
    autoMatch: false
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Here you would typically save to backend
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      localStorage.removeItem('user')
      router.push('/')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push Notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Get notified about new matches and messages
            </p>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showLocation">Show Location</Label>
              <Switch
                id="showLocation"
                checked={settings.showLocation}
                onCheckedChange={(checked) => handleSettingChange('showLocation', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showOnline">Show Online Status</Label>
              <Switch
                id="showOnline"
                checked={settings.showOnline}
                onCheckedChange={(checked) => handleSettingChange('showOnline', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoMatch">Auto Match</Label>
              <Switch
                id="autoMatch"
                checked={settings.autoMatch}
                onCheckedChange={(checked) => handleSettingChange('autoMatch', checked)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Automatically match with users who like you
            </p>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/profile/edit')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Terms of Service</span>
              <Button variant="link" className="p-0 h-auto text-sm">
                View
              </Button>
            </div>
            <div className="flex justify-between">
              <span>Privacy Policy</span>
              <Button variant="link" className="p-0 h-auto text-sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
