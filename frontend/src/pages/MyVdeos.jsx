import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import { getChannelVideos } from "../api/dashboardApi.js"
import { deleteVideo, togglePublishStatus } from "../api/videoApi.js"
import toast from "react-hot-toast"


function MyVideos() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const response = await getChannelVideos(user._id)
        setVideos(response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load your videos")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchMyVideos()
    }
  }, [user])

  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm("Delete this video? This cannot be undone.")
    if (!confirmDelete) return

    try {
      await deleteVideo(videoId)
      setVideos((prev) => prev.filter((video) => video._id !== videoId))
      toast.success("Video deleted")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete video")
    }
  }

  const handleTogglePublish = async (videoId) => {
    try {
      const response = await togglePublishStatus(videoId)
      const isPublished = response.data.data
      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, isPublished } : video
        )
      )
      toast.success(isPublished ? "Video published" : "Video unpublished")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update publish status")
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your videos</h1>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            <Upload size={16} />
            Upload new
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">
              You have not uploaded any videos yet.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="px-5 py-2 bg-black text-white rounded-full"
            >
              Upload your first video
            </button>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <div
                  onClick={() => navigate(`/watch/${video._id}`)}
                  className="relative aspect-video bg-gray-200 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        video.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {video.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3
                    onClick={() => navigate(`/watch/${video._id}`)}
                    className="font-medium line-clamp-2 mb-1 cursor-pointer hover:text-blue-600"
                  >
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {video.views || 0} views
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/edit-video/${video._id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleTogglePublish(video._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm"
                    >
                      {video.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                      {video.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(video._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-full text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default MyVideos
