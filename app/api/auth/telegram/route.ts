import { NextRequest, NextResponse } from 'next/server'
import { validateTelegramAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { initData, manualData } = await request.json()
    
    let telegramUser = null
    
    // Try to validate with initData first
    if (initData) {
      telegramUser = validateTelegramAuth(initData)
    }
    
    // If no valid initData, use manual data
    if (!telegramUser && manualData) {
      telegramUser = {
        id: parseInt(manualData.id) || Math.floor(Math.random() * 1000000),
        first_name: manualData.first_name || 'User',
        last_name: manualData.last_name || '',
        username: manualData.username || '',
        photo_url: manualData.photo_url || null,
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'manual_entry'
      }
    }
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Invalid authentication data' }, { status: 401 })
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
          age: 25, // Default age for new users
          gender: 'MALE', // Default gender, will be updated during onboarding
          bio: 'New user looking to meet amazing people!', // Default bio
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
