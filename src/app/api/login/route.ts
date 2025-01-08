import { type NextRequest } from 'next/server'
import dayjs from 'dayjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (email !== 'root@example.com' || password !== 'root') {
    return new Response(JSON.stringify({
      msg: "don't match",
    }), {
      status: 422,
    })
  }

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
    status: 201,
  })

}