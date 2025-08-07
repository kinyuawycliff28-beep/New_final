'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Edit, Settings, Heart, MessageCircle, MapPin, Calendar, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BottomNav } from '@/components/bottom-nav'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    matches: 0,
    likes: 0,
    messages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchUserStats(parsedUser.id)
  }, [router])

  const fetchUserStats = async (userId: string) => {
    try {
      // Fetch matches
      const matchesResponse = await fetch(`/api/matches?userId=${userId}`)
      const matchesData = await matchesResponse.json()
      
      // Fetch likes sent
      const likesResponse = await fetch(`/api/user/stats?userId=${userId}`)
      const likesData = await likesResponse.json()
      
      setStats({
        matches: matchesData.matches?.length || 0,
        likes: likesData.likes || 0,
        messages: likesData.messages || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const mainPhoto = user.photos?.find((p: any) => p.isMain)?.secureUrl
  const additionalPhotos = user.photos?.filter((p: any) => !p.isMain) || []

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/profile/edit')}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <Image
                    src={mainPhoto || '/placeholder.svg?height=100&width=100&query=profile'}
                    alt={user.fullName}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                  {user.username && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      @{user.username}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.fullName}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{user.age} years old</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span className="capitalize">{user.gender?.toLowerCase()}</span>
                  </div>
                  {user.latitude && user.longitude && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Location enabled</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">About Me</h3>
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || 'No bio added yet. Edit your profile to add one!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="text-2xl font-bold text-pink-600">{stats.matches}</div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.likes}</div>
                  <div className="text-sm text-gray-600">Likes Sent</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.messages}</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {additionalPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {additionalPhotos.map((photo: any, index: number) => (
                    <div key={photo.id} className="relative">
                      <Image
                        src={photo.secureUrl || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Telegram ID</span>
                <span className="font-mono text-sm">{user.telegramId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member since</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profile completed</span>
                <span className="text-green-600">✓ Complete</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/profile/edit')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
