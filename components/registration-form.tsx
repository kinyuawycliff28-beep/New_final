'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, MapPin, X, Check, Loader2 } from 'lucide-react'

interface RegistrationFormProps {
  user: any
  onComplete: (userData: any) => void
}

export function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: user?.first_name || user?.fullName || '',
    age: '',
    gender: '',
    bio: '',
    profilePicture: null as File | null,
    location: null as { lat: number; lng: number } | null
  })
  
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const getLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Could not get your location. Please enable location services.')
          setLocationLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      setLocationLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setFormData(prev => ({ ...prev, profilePicture: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }))
    setPreviewUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.age || !formData.gender || !formData.bio) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      // First, update user profile
      const response = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fullName: formData.name,
          age: formData.age,
          gender: formData.gender.toUpperCase(),
          bio: formData.bio,
          latitude: formData.location?.lat,
          longitude: formData.location?.lng,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const { user: updatedUser } = await response.json()
      setUploadProgress(50)

      // Upload profile picture if provided
      if (formData.profilePicture) {
        const formDataObj = new FormData()
        formDataObj.append('file', formData.profilePicture)
        formDataObj.append('userId', user.id)
        formDataObj.append('isMain', 'true')

        const uploadResponse = await fetch('/api/user/upload-photo', {
          method: 'POST',
          body: formDataObj,
        })

        if (!uploadResponse.ok) {
          console.error('Photo upload failed, but profile was created')
        }
      }

      setUploadProgress(100)
      
      setTimeout(() => {
        onComplete(updatedUser)
      }, 500)

    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-pink-600">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                required
                placeholder="Enter your age"
              />
            </div>

            <div>
              <Label>Gender *</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                required
              />
            </div>

            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    {uploadProgress > 0 && (
                      <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center">
                        <div className="text-white text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <div className="text-sm">Uploading... {uploadProgress}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-picture"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-pink-400 transition-colors"
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      Upload Photo (Optional)
                    </label>
                  </>
                )}
              </div>
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
                ) : formData.location ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Location Added
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Location (Optional)
                  </>
                )}
              </Button>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !formData.name || !formData.age || !formData.gender || !formData.bio} 
              className="w-full bg-pink-500 hover:bg-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
