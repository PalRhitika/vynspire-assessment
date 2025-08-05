import  { useState, useEffect } from 'react'
import axios from '../axios'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../store/auth'
import toast from 'react-hot-toast'

const EditPost = () => {
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { token } = useAuth()
  const { id } = useParams()

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}/`)
      setForm({ title: res.data.title, content: res.data.content })
    } catch (err) {
      console.log(err)
      setError('Post not found or unauthorized')
    }
  }

  useEffect(() => {
    fetchPost()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) return setError('All fields are required')

    try {
      await axios.put(`/posts/${id}/`, form)
      navigate(`/posts/${id}`)
      toast.success('Post updated Successfully!')
    } catch (err) {
      console.log(err)

      setError('Update failed')
    }
  }

  if (!token) return <p className="text-center mt-10 text-red-600">Login to edit posts</p>

  return (
    <div className="max-w-2xl mx-auto  p-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">🛠 Edit Post</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          className="w-full border text-black border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Update your content..."
          className="w-full border text-black border-purple-300 rounded px-4 py-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.content}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full py-2 rounded cursor-pointer bg-gradient-to-r  from-purple-600 to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
        >
         Update Post
        </button>
      </form>
    </div>
  )
}

export default EditPost
