'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BottomNav } from '@/components/bottom-nav'
import { UploadImage } from '@/components/upload-image'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
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
    setIsLoading(false)
  }, [router])

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)
    formData.append('isMain', 'false')

    const response = await fetch('/api/user/upload-photo', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      // Refresh user data
      window.location.reload()
    } else {
      throw new Error('Upload failed')
    }
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
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
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={user.photos?.find((p: any) => p.isMain)?.secureUrl || '/placeholder.svg?height=80&width=80&query=profile'}
                  alt={user.fullName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{user.fullName}</h3>
                  <p className="text-gray-600">{user.age} years old</p>
                  <p className="text-gray-600 capitalize">{user.gender.toLowerCase()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {user.photos?.map((photo: any, index: number) => (
                  <div key={photo.id} className="relative">
                    <Image
                      src={photo.secureUrl || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {photo.isMain && (
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add more photos */}
                {(!user.photos || user.photos.length < 3) && (
                  <UploadImage
                    onUpload={handlePhotoUpload}
                    className="h-32"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
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
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
              >
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
