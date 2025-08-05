

export default function PostCard({ post }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-indigo-900 to-purple-800 rounded-2xl p-6 overflow-hidden group hover:shadow-[0_25px_40px_-10px_rgba(255,255,255,0.15)] transition-transform transform hover:-translate-y-1">
      <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-tr from-pink-500 to-yellow-400 mix-blend-overlay" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-300">{new Date(post.created_at).toLocaleDateString()}</div>
          <div className="text-xs bg-indigo-600 px-2 py-1 rounded-full">
            {post.author?.username || 'Unknown'}
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-200 line-clamp-3">{post.content}</p>
      </div>
    </div>
  );
}
