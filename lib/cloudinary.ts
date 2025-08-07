import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file: File): Promise<{ publicId: string; secureUrl: string }> => {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'dating-app',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            publicId: result!.public_id,
            secureUrl: result!.secure_url,
          })
        }
      }
    ).end(buffer)
  })
}

export default cloudinary
