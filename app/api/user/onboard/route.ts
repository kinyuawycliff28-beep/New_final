import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, fullName, age, gender, bio, latitude, longitude } = await request.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        age: parseInt(age),
        gender,
        bio,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
      include: { photos: true }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Onboarding failed' }, { status: 500 })
  }
}
