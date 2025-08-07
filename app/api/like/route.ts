import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId } = await request.json()

    // Create the like
    const like = await prisma.like.create({
      data: {
        senderId,
        receiverId,
      }
    })

    // Check if the receiver has already liked the sender (mutual like)
    const mutualLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiverId,
          receiverId: senderId,
        }
      }
    })

    let match = null
    if (mutualLike) {
      // Create a match
      match = await prisma.match.create({
        data: {
          senderId,
          receiverId,
        }
      })
    }

    return NextResponse.json({ like, match })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 })
  }
}
