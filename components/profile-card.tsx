'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface User {
  id: string
  fullName: string
  age: number
  bio: string
  photos: { secureUrl: string }[]
}

interface ProfileCardProps {
  user: User
  onLike: (userId: string) => void
  onReject: (userId: string) => void
  onCardClick: (userId: string) => void
}

export function ProfileCard({ user, onLike, onReject, onCardClick }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const mainPhoto = user.photos[currentImageIndex]?.secureUrl || '/abstract-profile.png'

  const nextImage = () => {
    if (user.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % user.photos.length)
    }
  }

  const prevImage = () => {
    if (user.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length)
    }
  }

  return (
    <Card className="relative w-full max-w-sm mx-auto h-[600px] overflow-hidden bg-white shadow-xl">
      <div className="relative h-full">
        <Image
          src={mainPhoto || "/placeholder.svg"}
          alt={user.fullName}
          fill
          className="object-cover cursor-pointer"
          onClick={() => onCardClick(user.id)}
        />
        
        {/* Image navigation overlay */}
        {user.photos.length > 1 && (
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
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
              {user.photos.map((_, index) => (
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

        {/* User info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
          <h3 className="text-2xl font-bold mb-1">
            {user.fullName}, {user.age}
          </h3>
          <p className="text-sm opacity-90 line-clamp-2">{user.bio}</p>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 bg-white/90 hover:bg-white border-0"
            onClick={() => onReject(user.id)}
          >
            <X className="w-6 h-6 text-gray-600" />
          </Button>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-pink-500 hover:bg-pink-600 border-0"
            onClick={() => onLike(user.id)}
          >
            <Heart className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
