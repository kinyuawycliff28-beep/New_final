import crypto from 'crypto'

export function validateTelegramAuth(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    
    if (!hash) return false
    
    urlParams.delete('hash')
    
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    return calculatedHash === hash
  } catch (error) {
    console.error('Telegram auth validation error:', error)
    return false
  }
}
