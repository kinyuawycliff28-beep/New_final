'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadImageProps {
  onUpload: (file: File) => Promise<void>
  currentImage?: string
  onRemove?: () => void
  className?: string
}

export function UploadImage({ onUpload, currentImage, onRemove, className }: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      await onUpload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative group">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt="Profile"
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClick}
                disabled={isUploading}
                className="bg-white/90"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
              {onRemove && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemove}
                  disabled={isUploading}
                  className="bg-white/90"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <div className="text-sm">Uploading... {uploadProgress}%</div>
                <div className="w-32 bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-pink-400 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin mx-auto" />
              <span className="text-sm text-gray-500">Uploading... {uploadProgress}%</span>
              <div className="w-32 bg-gray-300 rounded-full h-2 mt-2 mx-auto">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Image</span>
              <span className="text-xs text-gray-400 mt-1">Max 10MB, JPG/PNG</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
