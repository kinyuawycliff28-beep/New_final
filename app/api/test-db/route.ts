import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const photoCount = await prisma.photo.count()
    const matchCount = await prisma.match.count()
    const messageCount = await prisma.chatMessage.count()
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful!',
      stats: {
        users: userCount,
        photos: photoCount,
        matches: matchCount,
        messages: messageCount
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Database connection failed',
      details: error
    }, { status: 500 })
  }
}
