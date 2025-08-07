'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadImage } from '@/components/upload-image'

export default function OnboardPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    bio: '',
  })
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      fullName: parsedUser.fullName || '',
      age: parsedUser.age?.toString() || '',
      gender: parsedUser.gender || '',
      bio: parsedUser.bio || '',
    })

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Location error:', error)
        }
      )
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = async (file: File) => {
    const formDataObj = new FormData()
    formDataObj.append('file', file)
    formDataObj.append('userId', user.id)
    formDataObj.append('isMain', 'true')

    const response = await fetch('/api/user/upload-photo', {
      method: 'POST',
      body: formDataObj,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          latitude: location?.latitude,
          longitude: location?.longitude,
        })
      })

      if (response.ok) {
        const { user: updatedUser } = await response.json()
        localStorage.setItem('user', JSON.stringify(updatedUser))
        router.push('/discover')
      } else {
        alert('Onboarding failed')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Onboarding failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Profile Photo</Label>
              <UploadImage
                onUpload={handlePhotoUpload}
                currentImage={user.photos?.[0]?.secureUrl}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600"
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
