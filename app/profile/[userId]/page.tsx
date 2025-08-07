'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Heart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface User {
  id: string
  fullName: string
  age: number
  bio: string
  photos: { secureUrl: string }[]
}

export default function ProfileDetailPage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<any>(null)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
    fetchProfileUser()
  }, [params.userId, router])

  const fetchProfileUser = async () => {
    try {
      const response = await fetch(`/api/discover?userId=${JSON.parse(localStorage.getItem('user') || '{}').id}`)
      const data = await response.json()
      
      if (response.ok) {
        const foundUser = data.users.find((u: User) => u.id === params.userId)
        setProfileUser(foundUser)
      }
    } catch (error) {
      console.error('Fetch profile user error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || !profileUser) return

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: profileUser.id,
        })
      })

      const data = await response.json()
      
      if (data.match) {
        alert('It\'s a match! 🎉')
      }
      
      router.back()
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleReject = () => {
    router.back()
  }

  const nextImage = () => {
    if (profileUser && profileUser.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profileUser.photos.length)
    }
  }

  const prevImage = () => {
    if (profileUser && profileUser.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + profileUser.photos.length) % profileUser.photos.length)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Profile not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const currentPhoto = profileUser.photos[currentImageIndex]?.secureUrl || '/abstract-profile.png'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="bg-white/90"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-96">
        <Image
          src={currentPhoto || "/placeholder.svg"}
          alt={profileUser.fullName}
          fill
          className="object-cover"
        />
        
        {/* Image navigation */}
        {profileUser.photos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0 top-0 h-full w-1/2 z-10"
            />
            <button
              onClick={nextImage}
              className="absolute right-0 top-0 h-full w-1/2 z-10"
            />
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-4 right-4 flex space-x-1">
              {profileUser.photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">
            {profileUser.fullName}, {profileUser.age}
          </h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">{profileUser.bio}</p>
          </div>

          {/* All Photos */}
          {profileUser.photos.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {profileUser.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-pink-500' : ''
                    }`}
                  >
                    <Image
                      src={photo.secureUrl || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 bg-white hover:bg-gray-50 border-2"
          onClick={handleReject}
        >
          <X className="w-6 h-6 text-gray-600" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-pink-500 hover:bg-pink-600"
          onClick={handleLike}
        >
          <Heart className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  )
}
