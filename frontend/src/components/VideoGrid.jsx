import VideoCard from "./Videocard.jsx"

function VideoGrid({ videos, emptyMessage = "No videos found.", onRemoveVideo }) {
  if (!videos || videos.length === 0) {
    return <p className="text-gray-600">{emptyMessage}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onRemove={onRemoveVideo}
        />
      ))}
    </div>
  )
}

export default VideoGrid