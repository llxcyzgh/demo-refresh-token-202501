'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { instance } from '@/axios-http/my-axios'

const Page = () => {
  const [curtime, setCurtime] = useState<string>('')

  const [tokens, setTokens] = useState({
    access_token: '',
    refresh_token: '',
  })

  async function getUser() {
    const { status, data } = await instance.get('/api/user')
    console.log('getStatus: ', status, data)
  }

  useEffect(() => {
    setInterval(() => {
      setCurtime(dayjs().format('YYYY-MM-DD HH:mm:ss'))

      setTokens({
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
      })

      // getUser()
    }, 1000)
  }, [])

  return (
    <div className="border p-10">
      <h1>Admin Page</h1>

      <div className="mt-10">
        {curtime}
      </div>

      <div>
        <div>{tokens.access_token}</div>
        <div>{tokens.refresh_token}</div>
      </div>

      <div>
        <button className="border rounded bg-sky-400" onClick={getUser}>click to trigger refresh token</button>
      </div>
    </div>
  )
}

export default Page