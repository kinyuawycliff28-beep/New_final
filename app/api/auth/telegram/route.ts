import { NextRequest, NextResponse } from 'next/server'
import { validateTelegramAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()
    
    const telegramUser = validateTelegramAuth(initData)
    if (!telegramUser) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { telegramId: telegramUser.id.toString() },
      include: { photos: true }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          telegramId: telegramUser.id.toString(),
          username: telegramUser.username,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          fullName: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
          age: 18, // Default age, will be updated during onboarding
          gender: 'MALE', // Default gender, will be updated during onboarding
          bio: '', // Empty bio, will be updated during onboarding
        },
        include: { photos: true }
      })

      // If Telegram has a profile photo, save it
      if (telegramUser.photo_url) {
        await prisma.photo.create({
          data: {
            userId: user.id,
            publicId: `telegram_${user.id}`,
            secureUrl: telegramUser.photo_url,
            isMain: true,
          }
        })
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
