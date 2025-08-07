'use client'

import { useState, useEffect } from 'react'
import { ProfileCard } from './profile-card'

interface User {
  id: string
  fullName: string
  age: number
  bio: string
  photos: { secureUrl: string }[]
}

interface CarouselProps {
  users: User[]
  onLike: (userId: string) => void
  onReject: (userId: string) => void
  onCardClick: (userId: string) => void
}

export function Carousel({ users, onLike, onReject, onCardClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLike = async (userId: string) => {
    if (isAnimating) return
    setIsAnimating(true)
    await onLike(userId)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  const handleReject = async (userId: string) => {
    if (isAnimating) return
    setIsAnimating(true)
    await onReject(userId)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex items-center justify-center h-[600px] text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No more profiles!</h2>
          <p className="text-gray-600">Check back later for new matches.</p>
        </div>
      </div>
    )
  }

  const currentUser = users[currentIndex]

  return (
    <div className="relative">
      <div className={`transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <ProfileCard
          user={currentUser}
          onLike={handleLike}
          onReject={handleReject}
          onCardClick={onCardClick}
        />
      </div>
    </div>
  )
}
