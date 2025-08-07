'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatBubble } from '@/components/chat-bubble'
import io, { Socket } from 'socket.io-client'

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    fullName: string
  }
}

export default function ChatPage({ params }: { params: { matchId: string } }) {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Initialize socket connection
    const socketInstance = io()
    setSocket(socketInstance)
    
    // Join the chat room
    socketInstance.emit('join-chat', params.matchId)
    
    // Listen for new messages
    socketInstance.on('receive-message', (message) => {
      setMessages(prev => [...prev, message])
    })
    
    fetchMessages()
    fetchMatchDetails(parsedUser.id)
    
    return () => {
      socketInstance.disconnect()
    }
  }, [params.matchId, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${params.matchId}`)
      const data = await response.json()
      
      if (response.ok) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Fetch messages error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMatchDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/matches?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        const match = data.matches.find((m: any) => m.id === params.matchId)
        if (match) {
          const other = match.sender.id === userId ? match.receiver : match.sender
          setOtherUser(other)
        }
      }
    } catch (error) {
      console.error('Fetch match details error:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || !otherUser) return

    const messageData = {
      matchId: params.matchId,
      senderId: user.id,
      receiverId: otherUser.id,
      content: newMessage.trim(),
    }

    try {
      const response = await fetch(`/api/chat/${params.matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const { message } = await response.json()
        setMessages(prev => [...prev, message])
        
        // Emit to socket for real-time delivery
        socket?.emit('send-message', message)
        
        setNewMessage('')
      }
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{otherUser?.fullName || 'Chat'}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            timestamp={new Date(message.createdAt)}
            isOwn={message.sender.id === user?.id}
            senderName={message.sender.fullName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
