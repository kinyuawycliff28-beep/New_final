import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { matchId: params.matchId },
      include: {
        sender: {
          select: { id: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Chat messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const { senderId, receiverId, content } = await request.json()

    const message = await prisma.chatMessage.create({
      data: {
        matchId: params.matchId,
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, fullName: true }
        }
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
