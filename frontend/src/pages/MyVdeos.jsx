import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Header from "../components/Header.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getUserVideos } from "../api/videoApi.js"
import { useNavigate } from "react-router-dom"
import { deleteVideo,togglePublishStatus } from "../api/videoApi.js"

function MyVideos() {
    const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const response = await getUserVideos(user._id)
        setVideos(response.data.data.docs || [])
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load your videos")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchMyVideos()
    }
  }, [user])

    const handleDelete = async (videoId) => {
  const confirmDelete = window.confirm("Delete this video?")
          if (!confirmDelete) {
    return
  }

  try {
    await deleteVideo(videoId)
    setVideos((prev) => prev.filter((video) => video._id !== videoId))
  } catch (error) {
    console.log(error?.response?.data?.message || "Failed to delete video")
  }
}

const handleTogglePublish = async (videoId) => {
  try {
    const response = await togglePublishStatus(videoId)
    const isPublished = response.data.data

    setVideos((prev) =>
      prev.map((video) =>
        video._id === videoId
          ? { ...video, isPublished }
          : video
      )
    )
  } catch (error) {
    console.log(error?.response?.data?.message || "Failed to update publish status")
  }
}

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your videos</h1>

        {loading && <p>Loading your videos...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-600">You have not uploaded any videos yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {videos.map((video) => (
    <div key={video._id}>
      <VideoCard video={video} />

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => navigate(`/edit-video/${video._id}`)}
          className="px-3 py-2 bg-gray-100 rounded-full"
        >
          Edit
        </button>

        <button
            onClick={() => handleTogglePublish(video._id)}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full"
            >
            {video.isPublished ? "Unpublish" : "Publish"}
        </button>
        
        <button
          onClick={() => handleDelete(video._id)}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-full"
        >
          Delete
        </button>

      </div>
    </div>
  ))}
</div>
      </section>
    </main>
  )
}

export default MyVideos