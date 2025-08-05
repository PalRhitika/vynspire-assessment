import React, { useState } from 'react'
import axios from '../axios'
import useAuth from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    if (!username || !password) {
      setLoading(false);

      return setError('All fields are required')

    }

    try {
      const res = await axios.post('/login/', { username, password })
      setToken(res.data.access_token)
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    }
     finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
       <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full mt-1 p-3 rounded-lg bg-white/10 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="you@example"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full mt-1 p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 bottom-4.5 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
           {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
