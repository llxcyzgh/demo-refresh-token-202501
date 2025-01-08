import { type NextRequest } from 'next/server'
import dayjs from 'dayjs'

export async function GET(req: NextRequest) {

  // get access_token
  const token = req.headers.get('Authorization') ?? ''
  const valid = checkAccessToken(token)

  if (!valid) {
    return new Response(JSON.stringify({
      msg: 'invalid access_token',
      input_token: token,
    }), {
      status: 401,
    })
  }

  return new Response(JSON.stringify({
    msg: 'success',
    input_token: token,
  }), {
    status: 200,
  })
}

function checkAccessToken(token: string): boolean {
  try {
    const { value, expire_at } = JSON.parse(token)

    return value === 'access_token' && dayjs(expire_at).isAfter(dayjs())
  } catch {
    return false
  }
}