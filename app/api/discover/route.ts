import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get users of opposite gender that haven't been liked or rejected
    const likedUserIds = await prisma.like.findMany({
      where: { senderId: userId },
      select: { receiverId: true }
    })

    const likedIds = likedUserIds.map(like => like.receiverId)

    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: currentUser.gender === 'MALE' ? 'FEMALE' : 'MALE',
        id: { notIn: likedIds },
        // Only show users who have completed onboarding
        age: { gt: 0 },
        bio: { not: '' }
      },
      include: {
        photos: {
          orderBy: { isMain: 'desc' }
        }
      },
      take: 20
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Discovery error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
