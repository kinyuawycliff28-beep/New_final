'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from '@/components/carousel'
import { BottomNav } from '@/components/bottom-nav'

interface User {
  id: string
  fullName: string
  age: number
  bio: string
  photos: { secureUrl: string }[]
}

export default function DiscoverPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
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
    fetchUsers(parsedUser.id)
  }, [router])

  const fetchUsers = async (userId: string) => {
    try {
      const response = await fetch(`/api/discover?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (receiverId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
        })
      })

      const data = await response.json()
      
      if (data.match) {
        alert('It\'s a match! 🎉')
      }
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleReject = async (userId: string) => {
    // Just move to next card, no need to store rejections
  }

  const handleCardClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Finding matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Discover</h1>
        
        <div className="flex justify-center">
          <Carousel
            users={users}
            onLike={handleLike}
            onReject={handleReject}
            onCardClick={handleCardClick}
          />
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
