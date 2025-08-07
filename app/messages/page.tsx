'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BottomNav } from '@/components/bottom-nav'
import { Card, CardContent } from '@/components/ui/card'

interface Match {
  id: string
  sender: {
    id: string
    fullName: string
    photos: { secureUrl: string }[]
  }
  receiver: {
    id: string
    fullName: string
    photos: { secureUrl: string }[]
  }
  messages: { content: string; createdAt: string }[]
}

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [matches, setMatches] = useState<Match[]>([])
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
    fetchMatches(parsedUser.id)
  }, [router])

  const fetchMatches = async (userId: string) => {
    try {
      const response = await fetch(`/api/matches?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        // Only show matches with messages
        const matchesWithMessages = data.matches.filter((match: Match) => match.messages.length > 0)
        setMatches(matchesWithMessages)
      }
    } catch (error) {
      console.error('Fetch matches error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchedUser = (match: Match) => {
    return match.sender.id === user?.id ? match.receiver : match.sender
  }

  const handleChatClick = (matchId: string) => {
    router.push(`/chat/${matchId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Messages</h1>
        
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No conversations yet</p>
            <p className="text-sm text-gray-400">Start chatting with your matches!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const matchedUser = getMatchedUser(match)
              const lastMessage = match.messages[0]
              
              return (
                <Card
                  key={match.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleChatClick(match.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={matchedUser.photos[0]?.secureUrl || '/placeholder.svg?height=60&width=60&query=profile'}
                          alt={matchedUser.fullName}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{matchedUser.fullName}</h3>
                        <p className="text-gray-600 text-sm truncate">
                          {lastMessage.content}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  )
}
