import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout.jsx"
import { getSubscribedChannels } from "../api/subscriptionApi.js"


function Subscriptions() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscribedChannels(user._id)
        setChannels(response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load subscriptions")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchSubscriptions()
    }
  }, [user])

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && channels.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">No subscriptions yet</p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-black text-white rounded-full"
            >
              Discover channels
            </button>
          </div>
        )}

        {!loading && !error && channels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((item) => {
              const channel = item.channel || item
              return (
                <button
                  key={channel._id}
                  onClick={() => navigate(`/channel/${channel.username}`)}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-14 h-14 rounded-full object-cover bg-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold truncate">
                      {channel.fullname || channel.username}
                    </h2>
                    <p className="text-sm text-gray-600 truncate">
                      @{channel.username}
                    </p>
                    {channel.subscribersCount !== undefined && (
                      <p className="text-xs text-gray-500">
                        {channel.subscribersCount} subscribers
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Subscriptions
