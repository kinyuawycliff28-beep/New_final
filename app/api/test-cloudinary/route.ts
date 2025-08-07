import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Test the connection by getting account details
    const result = await cloudinary.api.ping()
    
    return NextResponse.json({ 
      success: true,
      message: 'Cloudinary connection successful!',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      result
    })
  } catch (error) {
    console.error('Cloudinary test error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Cloudinary connection failed',
      details: error
    }, { status: 500 })
  }
}
