'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadImage } from '@/components/upload-image'
import { ArrowLeft, Save, MapPin, Loader2 } from 'lucide-react'

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    bio: '',
  })
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
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

    if (parsedUser.latitude && parsedUser.longitude) {
      setLocation({
        latitude: parsedUser.latitude,
        longitude: parsedUser.longitude
      })
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setLocationLoading(false)
        },
        (error) => {
          console.error('Location error:', error)
          alert('Could not get your location. Please enable location services.')
          setLocationLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      setLocationLoading(false)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    const formDataObj = new FormData()
    formDataObj.append('file', file)
    formDataObj.append('userId', user.id)
    formDataObj.append('isMain', 'false')

    const response = await fetch('/api/user/upload-photo', {
      method: 'POST',
      body: formDataObj,
    })

    if (response.ok) {
      // Refresh user data
      const updatedUserData = { ...user }
      const result = await response.json()
      if (!updatedUserData.photos) updatedUserData.photos = []
      updatedUserData.photos.push(result.photo)
      setUser(updatedUserData)
      localStorage.setItem('user', JSON.stringify(updatedUserData))
    } else {
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
        setUser(updatedUser)
        alert('Profile updated successfully!')
        router.push('/profile')
      } else {
        const error = await response.json()
        alert(error.error || 'Update failed')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Update failed')
    } finally {
      setIsLoading(false)
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
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-pink-600">Update Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photos */}
            <div>
              <Label>Profile Photos</Label>
              <div className="mt-2 space-y-4">
                {/* Main photo */}
                <div>
                  <Label className="text-sm text-gray-600">Main Photo</Label>
                  <UploadImage
                    onUpload={handlePhotoUpload}
                    currentImage={user.photos?.find((p: any) => p.isMain)?.secureUrl}
                    className="mt-2"
                  />
                </div>
                
                {/* Additional photos */}
                <div>
                  <Label className="text-sm text-gray-600">Additional Photos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {user.photos?.filter((p: any) => !p.isMain).map((photo: any, index: number) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.secureUrl || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    
                    {(!user.photos || user.photos.filter((p: any) => !p.isMain).length < 3) && (
                      <UploadImage
                        onUpload={handlePhotoUpload}
                        className="h-24"
                      />
                    )}
                  </div>
                </div>
              </div>
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
                rows={4}
                required
              />
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={locationLoading}
                className="w-full"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : location ? (
                  <>
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    Location Updated
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Update Location
                  </>
                )}
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
