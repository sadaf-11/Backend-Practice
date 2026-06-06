import { useNavigate } from "react-router-dom"

function VideoCard({ video }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="cursor-pointer group"
    >
      <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {Math.round(video.duration || 0)}s
        </div>
      </div>

      <div 
      onClick={(e)=>{
        e.stopPropagation()
        navigate(`/channel/${video.owner?.username}`)
      }}
      className="flex gap-3 cursor-pointer">
        <img
          src={video.owner?.avatar}
          alt={video.owner?.username}
          className="w-9 h-9 rounded-full object-cover bg-gray-300"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium line-clamp-2 mb-1">
            {video.title}
          </h3>

          <p className="text-sm text-gray-600">
            {video.owner?.fullname || video.owner?.username}
          </p>

          <p className="text-sm text-gray-600">
            {video.views || 0} views
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
