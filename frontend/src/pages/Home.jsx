import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getAllVideos } from "../api/videoApi.js"
// import VideoGrid from "../components/VideoGrid.jsx"

function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await getAllVideos(query)
        setVideos(response.data.data.docs || response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load videos")
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [query])

  return (
    <MainLayout>
      <div className="p-6">
        {query && (
          <h1 className="text-xl font-bold mb-4">
            Search results for "{query}"
          </h1>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-3" />
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No videos found</p>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Home