'use client'

import { format } from 'date-fns'

interface ChatBubbleProps {
  message: string
  timestamp: Date
  isOwn: boolean
  senderName?: string
}

export function ChatBubble({ message, timestamp, isOwn, senderName }: ChatBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-pink-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        {!isOwn && senderName && (
          <p className="text-xs font-semibold mb-1">{senderName}</p>
        )}
        <p className="text-sm">{message}</p>
        <p className={`text-xs mt-1 ${
          isOwn ? 'text-pink-100' : 'text-gray-500'
        }`}>
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  )
}
