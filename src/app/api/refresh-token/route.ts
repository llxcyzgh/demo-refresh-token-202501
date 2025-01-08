import { type NextRequest } from 'next/server'
import dayjs from 'dayjs'

export async function PUT(req: NextRequest) {
  const { refresh_token } = await req.json()
  const valid = checkRefreshToken(refresh_token)

  if (!valid) {
    return new Response(JSON.stringify({
      msg: 'invalid refresh_token',
      input_token: refresh_token,
    }), {
      status: 403,
    })
  }

  await sleep(2000)

  return new Response(JSON.stringify({
    access_token: {
      value: 'access_token',
      expire_at: dayjs().add(5, 'second').format('YYYY-MM-DD HH:mm:ss'),
    },
    refresh_token: {
      value: 'refresh_token',
      expire_at: dayjs().add(30, 'second').format('YYYY-MM-DD HH:mm:ss'),
    },
  }), {
    status: 200,
  })

}

function checkRefreshToken(token: string): boolean {
  try {
    const { value, expire_at } = JSON.parse(token)

    return value === 'refresh_token' && dayjs(expire_at).isAfter(dayjs())
  } catch {
    return false
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}