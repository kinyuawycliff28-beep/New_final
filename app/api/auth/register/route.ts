import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const userData = {
      telegramId: formData.get('telegramId') as string,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: (formData.get('gender') as string).toUpperCase(),
      bio: formData.get('bio') as string,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    }

    // Handle profile picture upload with Cloudinary
    const profilePicture = formData.get('profilePicture') as File
    let profilePictureUrl = null
    
    if (profilePicture && profilePicture.size > 0) {
      try {
        const { secureUrl } = await uploadImage(profilePicture)
        profilePictureUrl = secureUrl
      } catch (error) {
        console.error('Image upload failed:', error)
        return NextResponse.json({
          error: 'Failed to upload profile picture'
        }, { status: 400 })
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: userData.telegramId }
    })

    let user
    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { telegramId: userData.telegramId },
        data: {
          fullName: userData.name,
          age: userData.age,
          gender: userData.gender as 'MALE' | 'FEMALE',
          bio: userData.bio,
          latitude: userData.latitude,
          longitude: userData.longitude,
        },
        include: { photos: true }
      })
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          telegramId: userData.telegramId,
          firstName: userData.name.split(' ')[0],
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          fullName: userData.name,
          age: userData.age,
          gender: userData.gender as 'MALE' | 'FEMALE',
          bio: userData.bio,
          latitude: userData.latitude,
          longitude: userData.longitude,
        },
        include: { photos: true }
      })
    }

    // Add profile picture if uploaded
    if (profilePictureUrl) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          publicId: `profile_${user.id}_${Date.now()}`,
          secureUrl: profilePictureUrl,
          isMain: true,
        }
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
