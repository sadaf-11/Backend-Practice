import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header.jsx"
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
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load subscriptions")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchSubscriptions()
    }
  }, [user])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

        {loading && <p>Loading subscriptions...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && channels.length === 0 && (
          <p className="text-gray-600">No subscriptions yet.</p>
        )}

        <div className="space-y-4">
          {channels.map((item) => {
            const channel = item.channel || item

            return (
              <button
                key={channel._id}
                onClick={() => navigate(`/channel/${channel.username}`)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-xl text-left"
              >
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  className="w-14 h-14 rounded-full object-cover bg-gray-300"
                />

                <div>
                  <h2 className="font-semibold">
                    {channel.fullname || channel.username}
                  </h2>

                  <p className="text-sm text-gray-600">
                    @{channel.username}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default Subscriptions