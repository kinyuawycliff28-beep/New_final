import { NextRequest, NextResponse } from 'next/server'
import { validateTelegramAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { initData, user: telegramUser } = await request.json()
    
    // Validate Telegram authentication
    const validatedUser = validateTelegramAuth(initData)
    if (!validatedUser && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid Telegram authentication' }, { status: 401 })
    }

    const userToProcess = validatedUser || telegramUser

    if (!userToProcess) {
      return NextResponse.json({ error: 'No user data provided' }, { status: 400 })
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { telegramId: userToProcess.id.toString() },
      include: { photos: true }
    })

    let isNewUser = false

    if (!user) {
      // Create new user
      isNewUser = true
      user = await prisma.user.create({
        data: {
          telegramId: userToProcess.id.toString(),
          username: userToProcess.username,
          firstName: userToProcess.first_name,
          lastName: userToProcess.last_name,
          fullName: `${userToProcess.first_name} ${userToProcess.last_name || ''}`.trim(),
          age: 25, // Default age for new users
          gender: 'MALE', // Default gender, will be updated during onboarding
          bio: '', // Empty bio indicates need for onboarding
        },
        include: { photos: true }
      })

      // If Telegram has a profile photo, save it
      if (userToProcess.photo_url) {
        await prisma.photo.create({
          data: {
            userId: user.id,
            publicId: `telegram_${user.id}`,
            secureUrl: userToProcess.photo_url,
            isMain: true,
          }
        })
      }
    }

    return NextResponse.json({ user, isNewUser })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
