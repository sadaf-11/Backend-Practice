import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getUserChannelProfile } from "../api/userApi.js"
import { getUserVideos } from "../api/videoApi.js"
import { toggleSubscription } from "../api/subscriptionApi.js"

function Channel() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true)
        setError("")
        const channelResponse = await getUserChannelProfile(username)
        const channelData = channelResponse.data.data

        setChannel(channelData)

        const videosResponse = await getUserVideos(channelData._id)
        setVideos(videosResponse.data.data.docs || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load channel")
      } finally {
        setLoading(false)
      }
    }
    fetchChannel()
  }, [username])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    try {
      await toggleSubscription(channel._id)
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }))
    } catch (err) {
      console.log(err?.response?.data?.message || "Failed to subscribe")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading channel...</div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 text-center text-red-500">{error}</div>
      </MainLayout>
    )
  }

  if (!channel) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Channel not found</div>
      </MainLayout>
    )
  }

  const isOwnChannel = user?._id === channel._id

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Cover Image */}
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={channel.username}
            className="w-full h-48 md:h-64 object-cover bg-gray-200"
          />
        ) : (
          <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500" />
        )}

        {/* Channel Info */}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={channel.avatar}
                alt={channel.username}
                className="w-20 h-20 rounded-full object-cover bg-gray-300 ring-2 ring-white"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {channel.fullname || channel.username}
                </h1>
                <p className="text-gray-600">@{channel.username}</p>
                {channel.subscribersCount !== undefined && (
                  <p className="text-sm text-gray-600">
                    {channel.subscribersCount} subscribers
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwnChannel ? (
                <button
                  onClick={() => navigate("/settings")}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className={`px-5 py-2 rounded-full font-medium transition-colors ${
                    channel.isSubscribed
                      ? "bg-gray-100 text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>

          {/* Tabs / Videos Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
              <h2 className="text-xl font-bold">Videos</h2>
              {isOwnChannel && (
                <button
                  onClick={() => navigate("/upload")}
                  className="px-4 py-1.5 bg-black text-white text-sm rounded-full"
                >
                  + Upload
                </button>
              )}
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No videos uploaded yet.</p>
                {isOwnChannel && (
                  <button
                    onClick={() => navigate("/upload")}
                    className="mt-4 px-5 py-2 bg-black text-white rounded-full"
                  >
                    Upload your first video
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Channel
