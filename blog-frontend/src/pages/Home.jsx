import  { useEffect, useState } from 'react'
import axios from '../axios'
import { Link} from 'react-router-dom'
import useAuth from '../store/auth'
import toast from 'react-hot-toast'
const Home = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()
  // const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/posts/?page=${page}&limit=5`)
      setPosts(res.data.results)
      setTotalPages(res.data.pages)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await axios.delete(`/posts/${id}/`)
      toast.success('Post deleted successfully')
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center pt-2">📚 Blog Posts</h1>
      {posts.length === 0 ? (
  <p className="text-center text-gray-500 mt-10">No posts yet.</p>
) : (
  <>
    {posts.map((post) => (
      <div key={post.id} className="border rounded p-4 mb-4 shadow-sm">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="text-gray-400 mb-2">{post.content.slice(0, 100)}...</p>
        <p className="text-sm text-gray-500">By {post.author} on {new Date(post.created_at).toLocaleString()}</p>
        <div className="mt-2 flex gap-4">
          <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">Read More</Link>
          {token && (
            <>
              <Link to={`/edit/${post.id}`} className="text-green-600 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
            </>
          )}
        </div>
      </div>
    ))}

    {/* Pagination */}
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className={`px-3 py-1 rounded text-black ${page === 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
      >
        Prev
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className={`px-3 py-1 rounded text-black ${page === totalPages ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
      >
        Next
      </button>
    </div>
  </>
)}

    </div>
  )
}

export default Home
