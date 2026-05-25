import { useEffect, useState } from "react"
import "./App.css"
import api from "./api/axios.js"

function App() {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/api/v1/videos")
        setVideos(response.data.data.docs || [])
      } catch (error) {
        setError(error.response?.data?.message || "failed to fetch videos")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) {
    return <h1>Loading videos...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <main>
      <h1>Videos</h1>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <article className="video-card" key={video._id}>
              {video.thumbnail && (
                <img
                  className="video-thumbnail"
                  src={video.thumbnail}
                  alt={video.title}
                />
              )}

              <h2>{video.title}</h2>
              <p>{video.description}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default App
