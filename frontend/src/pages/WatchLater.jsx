import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Clock } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoGrid from "../components/VideoGrid.jsx"
import { getWatchLater, removeVideoFromPlaylist } from "../api/playlistApi.js"
import toast from "react-hot-toast"

function WatchLater() {
  const { user } = useSelector((state) => state.auth)

  const [playlistId, setPlaylistId] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const response = await getWatchLater()
        setPlaylistId(response.data.data?._id)
        setVideos(response.data.data?.videos || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load Watch Later")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchWatchLater()
    }
  }, [user])

  const handleRemoveVideo = async (videoId) => {
    if (!playlistId) return
    if (!window.confirm("Remove this video from Watch Later?")) return

    try {
      await removeVideoFromPlaylist(playlistId, videoId)
      setVideos((prev) => prev.filter((v) => v._id !== videoId))
      toast.success("Removed from Watch Later")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove video")
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Clock size={28} />
          Watch Later
        </h1>
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          emptyMessage="No videos saved to Watch Later yet"
          onRemoveVideo={handleRemoveVideo}
        />
      </div>
    </MainLayout>
  )
}

export default WatchLater
