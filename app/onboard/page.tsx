'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/registration-form'

export default function OnboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  const handleRegistrationComplete = (updatedUser: any) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    router.push('/discover')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <RegistrationForm 
      user={user} 
      onComplete={handleRegistrationComplete} 
    />
  )
}
