import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Header from "../components/Header.jsx"
import VideoCard from "../components/Videocard.jsx"
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
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load liked videos")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchLikedVideos()
    }
  }, [user])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Liked videos</h1>

        {loading && <p>Loading liked videos...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && videos.length === 0 && (
          <p className="text-gray-600">No liked videos yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default LikedVideos