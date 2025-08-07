import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get likes sent by user
    const likesCount = await prisma.like.count({
      where: { senderId: userId }
    })

    // Get messages sent by user
    const messagesCount = await prisma.chatMessage.count({
      where: { senderId: userId }
    })

    return NextResponse.json({ 
      likes: likesCount,
      messages: messagesCount
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
