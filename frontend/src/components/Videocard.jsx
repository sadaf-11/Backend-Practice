import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { formatDuration } from "../utils/formatDuration.js"

function VideoCard({ video, onRemove }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="cursor-pointer group relative"
    >
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(video._id)
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
          title="Remove from playlist"
        >
          <X size={16} />
        </button>
      )}
      <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
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
