'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadImageProps {
  onUpload: (file: File) => Promise<void>
  currentImage?: string
  onRemove?: () => void
  className?: string
}

export function UploadImage({ onUpload, currentImage, onRemove, className }: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
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
                <Upload className="w-4 h-4" />
              </Button>
              {onRemove && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemove}
                  className="bg-white/90"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-pink-400 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </button>
      )}
    </div>
  )
}
