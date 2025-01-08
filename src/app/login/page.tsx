'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { instance } from '@/axios-http/my-axios'

interface Inputs {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter()

  const [inputs, setInputs] = useState<Inputs>({
    email: 'root@example.com',
    password: 'root',
  })

  async function handleLogin() {
    const { status, data } = await instance.post('/api/login', inputs)
    if (status === 201) {
      const { access_token, refresh_token } = data

      localStorage.setItem('access_token', JSON.stringify(access_token))
      localStorage.setItem('refresh_token', JSON.stringify(refresh_token))

      router.push('/admin')
    }
  }

  return (
    <div className="flex justify-between h-screen items-center">
      <div className="pb-60">
        <div className="border rounded p-10">
          <h1 className="font-bold text-center text-2xl pb-10">Login</h1>
          <div className="space-y-4">
            <div>
              <label>
                <span className="inline-block w-20">Email</span>
                <input
                  className="border rounded p-1"
                  type="email"
                  value={inputs.email}
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                />
              </label>
            </div>

            <div>
              <label>
                <span className="inline-block w-20">Password</span>
                <input
                  className="border rounded p-1"
                  type="password"
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
              </label>
            </div>

            <div>
              <button
                className="w-full p-1 border rounded bg-slate-700 text-slate-100"
                onClick={handleLogin}
              >Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
