import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getUserChannelProfile } from "../api/userApi.js"
import { getUserVideos } from "../api/videoApi.js"
import { toggleSubscription } from "../api/subscriptionApi.js"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function Channel() {
  const { username } = useParams()
  const navigate = useNavigate()
const { isAuthenticated } = useSelector((state) => state.auth)

  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelResponse = await getUserChannelProfile(username)
        const channelData = channelResponse.data.data

        setChannel(channelData)

        const videosResponse = await getUserVideos(channelData._id)
        setVideos(videosResponse.data.data.docs || [])
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load channel")
      } finally {
        setLoading(false)
      }
    }

    fetchChannel()
  }, [username])

  if (loading) {
    return <p>Loading channel...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!channel) {
    return <p>Channel not found</p>
  }

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
      } catch (error) {
    console.log(error?.response?.data?.message || "Failed to subscribe")
  }
}

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-6xl mx-auto">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt={channel.username}
            className="w-full h-48 object-cover rounded-xl bg-gray-200"
          />
        )}

        <div className="flex items-center gap-4 mt-6">
          <img
            src={channel.avatar}
            alt={channel.username}
            className="w-20 h-20 rounded-full object-cover bg-gray-300"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {channel.fullname || channel.username}
            </h1>

            <p className="text-gray-600">
              @{channel.username}
            </p>

            {channel.subscribersCount !== undefined && (
              <p className="text-sm text-gray-600">
                {channel.subscribersCount} subscribers
              </p>
            )}
          </div>

          <button
                onClick={handleSubscribe}
                className={`px-5 py-2 rounded-full ${
                    channel.isSubscribed
                    ? "bg-gray-100 text-black"
                    : "bg-black text-white"
                }`}
                >
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Videos</h2>

        {videos.length === 0 && (
          <p className="text-gray-600">No videos uploaded yet.</p>
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

export default Channel