import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

// Helper to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    const now = Date.now() / 1000
    return decoded.exp < now
  } catch (err) {
    return true
  }
}

const useAuth = create((set) => {
  const token = localStorage.getItem('token')
  let user = null

  if (token && !isTokenExpired(token)) {
    try {
      user = jwtDecode(token)
    } catch (err) {
      console.error('Invalid token', err)
      localStorage.removeItem('token')
    }
  } else {
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    setToken: (token) => {
      let user = null
      try {
        user = jwtDecode(token)
        localStorage.setItem('token', token)
        set({ token, user })
      } catch (err) {
        console.error('Invalid token')
        set({ token: null, user: null })
      }
    },
    logout: () => {
      localStorage.removeItem('token')
      set({ token: null, user: null })
    }
  }
})

export default useAuth
