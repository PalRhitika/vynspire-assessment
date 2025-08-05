import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../axios'
import useAuth from '../store/auth'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const { token } = useAuth()

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}/`)
      setPost(res.data)
    } catch (err) {
      console.log(err)
      setError('Post not found')
    }
  }

  useEffect(() => {
    fetchPost()
  }, [])

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>
  if (!post) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto  p-8 bg-gradient-to-br from-white to-orange-100 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
      <p className="text-sm text-gray-500">
        By {post.author} on {new Date(post.created_at).toLocaleString()}
      </p>
      {token && (
        <Link
          to={`/edit/${post.id}`}
          className="mt-4 inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform"
        >
          ✏️ Edit Post
        </Link>
      )}
    </div>
  )
}

export default PostDetail
