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
  const urlParams = new URLSearchParams(initData)
  const hash = urlParams.get('hash')
  
  if (!hash) return null

  // For development, allow mock hash
  if (hash === 'mock_hash_for_dev' && process.env.NODE_ENV === 'development') {
    const user = JSON.parse(urlParams.get('user') || '{}')
    return user
  }

  urlParams.delete('hash')
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest()

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (calculatedHash !== hash) return null

  const user = JSON.parse(urlParams.get('user') || '{}')
  return user
}
