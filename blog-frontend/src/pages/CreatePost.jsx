import React, { useState } from 'react'
import axios from '../axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import toast from 'react-hot-toast'
const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { token } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { title, content } = form
    if (!title || !content) {
      return setError('All fields are required')
    }

    try {
      await axios.post('/posts/', form)
      navigate('/')
      toast.success('Post published Successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post')
    }
  }

  if (!token) return <p className="text-center mt-10 text-red-600">Login to create a post</p>

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">✍️ Create a New Post</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          className="w-full border text-black border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Write your content..."
          className="w-full border text-black border-blue-300 rounded px-4 py-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.content}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform"
        >
          🚀 Publish
        </button>
      </form>
    </div>
  )
}

export default CreatePost
