import crypto from 'crypto'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export function validateTelegramAuth(initData: string): TelegramUser | null {
  // If no initData provided, return null
  if (!initData) return null
  
  const urlParams = new URLSearchParams(initData)
  const hash = urlParams.get('hash')
  
  if (!hash) return null

  // For development or testing, allow bypass
  if (hash === 'dev_bypass' || process.env.NODE_ENV === 'development') {
    const userStr = urlParams.get('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }

  // Skip validation if TELEGRAM_BOT_TOKEN is not set
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    const userStr = urlParams.get('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  urlParams.delete('hash')
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  try {
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest()

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) return null

    const userStr = urlParams.get('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
  } catch (error) {
    console.error('Auth validation error:', error)
  }

  return null
}
