import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoGrid from "../components/VideoGrid.jsx"
import { getWatchHistory } from "../api/historyApi.js"

function WatchHistory() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getWatchHistory()
        setVideos(response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Watch history</h1>
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          emptyMessage="No watch history yet"
        />
      </div>
    </MainLayout>
  )
}

export default WatchHistory
