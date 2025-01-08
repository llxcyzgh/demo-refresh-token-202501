import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  validateStatus: (status) => {
    return status < 500
  },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = token
  }

  return config
})

instance.interceptors.response.use(
  async (response) => {
    if (response.status === 401) {
      // 刷新 token
      if (await refreshToken()) {
        // 重放请求
        return await instance.request(response.config)
      } else {
        window.location.href = '/login'
      }
    } else if (response.status === 403) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'

      return Promise.reject('error to refresh token')
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

let promise: Promise<boolean> | null //Promise
async function refreshToken() {
  if (promise) {
    return promise
  }
  promise = new Promise(async (resolve) => {
    const { status, data } = await axios.put('/api/refresh-token', {
      refresh_token: localStorage.getItem('refresh_token'),
    }, {
      validateStatus: (status) => status < 500,
    })

    if (status !== 200) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      resolve(false)
    } else {
      const { access_token, refresh_token } = data
      localStorage.setItem('access_token', JSON.stringify(access_token))
      localStorage.setItem('refresh_token', JSON.stringify(refresh_token))
      resolve(true)
    }
  })

  promise.finally(() => {
    promise = null
  })

  return promise
}

export {
  instance,
}