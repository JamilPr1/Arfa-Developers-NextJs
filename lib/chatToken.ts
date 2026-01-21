import crypto from 'crypto'

type ChatTokenPayload = {
  v: 1
  sessionId: string
  channelId: string
  threadTs: string
  iat: number
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8')
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecodeToString(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = (4 - (padded.length % 4)) % 4
  const withPad = padded + '='.repeat(padLen)
  return Buffer.from(withPad, 'base64').toString('utf8')
}

export function signChatToken(payload: Omit<ChatTokenPayload, 'v' | 'iat'>, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const fullPayload: ChatTokenPayload = { v: 1, iat: Math.floor(Date.now() / 1000), ...payload }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest()
  const encodedSig = base64UrlEncode(signature)
  return `${data}.${encodedSig}`
}

export function verifyChatToken(token: string, secret: string): ChatTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [encodedHeader, encodedPayload, encodedSig] = parts
    const data = `${encodedHeader}.${encodedPayload}`
    const expected = crypto.createHmac('sha256', secret).update(data).digest()
    const expectedEncoded = base64UrlEncode(expected)

    // constant-time compare
    const a = Buffer.from(expectedEncoded)
    const b = Buffer.from(encodedSig)
    if (a.length !== b.length) return null
    if (!crypto.timingSafeEqual(a, b)) return null

    const payloadStr = base64UrlDecodeToString(encodedPayload)
    const payload = JSON.parse(payloadStr) as ChatTokenPayload
    if (payload?.v !== 1) return null
    if (!payload.sessionId || !payload.channelId || !payload.threadTs) return null
    return payload
  } catch {
    return null
  }
}

