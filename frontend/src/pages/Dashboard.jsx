import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Video, Users, ThumbsUp, TrendingUp, Upload } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getChannelStats, getChannelVideos } from "../api/dashboardApi.js"
import { togglePublishStatus } from "../api/videoApi.js"

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("published")

  const publishedVideos = videos.filter((video) => video.isPublished)
  const unpublishedVideos = videos.filter((video) => !video.isPublished)

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?._id) return
      try {
        setLoading(true)
        setError("")
        const [statsResponse, videosResponse] = await Promise.all([
          getChannelStats(user._id),
          getChannelVideos(user._id),
        ])
        setStats(statsResponse.data.data)
        setVideos(videosResponse.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [user])

  const handleTogglePublish = async (videoId) => {
    try {
      const response = await togglePublishStatus(videoId)
      const isPublished = response.data.data
      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, isPublished } : video
        )
      )
    } catch (err) {
      console.log(err?.response?.data?.message || "Failed to update publish status")
    }
  }

  const statCards = [
    {
      label: "Total videos",
      value: stats?.totalVideos || 0,
      icon: Video,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total views",
      value: stats?.totalViews || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Subscribers",
      value: stats?.totalSubscribers || 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total likes",
      value: stats?.totalLikes || 0,
      icon: ThumbsUp,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ]

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your channel</p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            <Upload size={16} />
            Upload video
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-gray-200 rounded-lg p-4"
              >
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.label}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${card.bg}`}>
                        <Icon size={18} className={card.color} />
                      </div>
                      <p className="text-sm text-gray-600">{card.label}</p>
                    </div>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("published")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "published"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Published ({publishedVideos.length})
              </button>
              <button
                onClick={() => setActiveTab("unpublished")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "unpublished"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Drafts ({unpublishedVideos.length})
              </button>
            </div>

            {/* Videos Grid */}
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 mb-4">No videos uploaded yet</p>
                <button
                  onClick={() => navigate("/upload")}
                  className="px-5 py-2 bg-black text-white rounded-full"
                >
                  Upload your first video
                </button>
              </div>
            ) : (
              <>
                {activeTab === "published" && (
                  <>
                    {publishedVideos.length === 0 ? (
                      <p className="text-center text-gray-500 py-10">
                        No published videos yet
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedVideos.map((video) => (
                          <div key={video._id}>
                            <VideoCard video={video} />
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                Published
                              </span>
                              <button
                                onClick={() => handleTogglePublish(video._id)}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm"
                              >
                                Unpublish
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "unpublished" && (
                  <>
                    {unpublishedVideos.length === 0 ? (
                      <p className="text-center text-gray-500 py-10">
                        No draft videos
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {unpublishedVideos.map((video) => (
                          <div key={video._id}>
                            <VideoCard video={video} />
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                Draft
                              </span>
                              <button
                                onClick={() => handleTogglePublish(video._id)}
                                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm"
                              >
                                Publish
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default Dashboard
