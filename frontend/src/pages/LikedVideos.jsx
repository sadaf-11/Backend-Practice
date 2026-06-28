import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoGrid from "../components/VideoGrid.jsx"
import { getLikedVideos } from "../api/likeApi.js"

function LikedVideos() {
  const { user } = useSelector((state) => state.auth)

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await getLikedVideos(user._id)
        setVideos(response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load liked videos")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchLikedVideos()
    }
  }, [user])

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Liked videos</h1>
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          emptyMessage="No liked videos yet"
        />
      </div>
    </MainLayout>
  )
}

export default LikedVideos
