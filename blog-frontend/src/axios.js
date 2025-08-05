import axios from 'axios'
import {jwtDecode} from 'jwt-decode'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

//  Token auto-refresh interceptor
instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refresh_token')

  if (token) {
    try {
      const decoded = jwtDecode(token)
      const now = Date.now() / 1000

      if (decoded.exp < now) {
        // Refresh token if expired
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
              { refresh: refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            )

            const newToken = response.data.access
            localStorage.setItem('token', newToken)

            config.headers['Authorization'] = `Bearer ${newToken}`
          } catch (refreshErr) {
            console.error('Refresh token expired or invalid', refreshErr)
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            // Optional: redirect to login
          }
        }
      } else {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    } catch (err) {
      console.error('Error decoding token:', err)
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
    }
  }

  return config
}, (error) => Promise.reject(error))

export default instance
