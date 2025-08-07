import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const isMain = formData.get('isMain') === 'true'

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    const { publicId, secureUrl } = await uploadImage(file)

    // If this is the main photo, update existing main photo
    if (isMain) {
      await prisma.photo.updateMany({
        where: { userId, isMain: true },
        data: { isMain: false }
      })
    }

    const photo = await prisma.photo.create({
      data: {
        userId,
        publicId,
        secureUrl,
        isMain,
      }
    })

    return NextResponse.json({ photo })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
