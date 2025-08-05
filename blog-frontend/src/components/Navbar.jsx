
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'

const Navbar = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="flex justify-between items-center p-4 bg-black/80 backdrop-blur sticky top-0 z-50 ">
       <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-500">
        Vynspire Blog
      </Link>
      <div className="flex gap-4">

        {!token ? (
          <>
            <Link to="/login" className="px-4 py-2 border rounded-full text-sm text-white">Login</Link>
            <Link to="/register" className="px-4 py-2 text-white bg-gradient-to-r from-fuchsia-400 to-indigo-500 rounded-full text-sm font-medium">Register</Link>
          </>
        ) : (
          <>
            <Link to="/create"><button className="px-4 py-2 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-sm font-medium shadow-lg">
                New Post
              </button></Link>
            <button onClick={() => { logout();  navigate('/'); window.location.reload(); }} className="px-3 py-1 bg-red-500 rounded-full text-sm text-white">Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
