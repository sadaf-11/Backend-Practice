import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Trash2, Edit, MessageCircle, Send } from "lucide-react"
import toast from "react-hot-toast"
import MainLayout from "../layouts/MainLayout.jsx"
import { getAllTweets,getUserTweets, createTweet, updateTweet, deleteTweet } from "../api/tweetsApi.js"
import { toggleTweetLike } from "../api/likeApi.js"
import { ThumbsUp  } from "lucide-react"

function Tweets() {
  const { username } = useParams() // optional - view another user's tweets
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth)

  const [tweets, setTweets] = useState([])
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
  const fetchTweets = async () => {
    try {
      setLoading(true)
      setError("")

      if (username) {
        const channelResponse = await fetch(`/api/v1/users/c/${username}`)
        const channelData = await channelResponse.json()
        const targetUserId = channelData.data._id

        const response = await getUserTweets(targetUserId)
        setTweets(response.data.data || [])
      } else {
        const response = await getAllTweets()
        setTweets(response.data.data || [])
      }
    } catch (err) {
      console.log(err?.response?.data || err)
      setError(err?.response?.data?.message || "Failed to load tweets")
    } finally {
      setLoading(false)
    }
  }

  fetchTweets()
}, [username])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      setPosting(true)
      const response = await createTweet(content)
      setTweets((prev) => [response.data.data, ...prev])
      setContent("")
      toast.success("Tweet posted!")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post tweet")
    } finally {
      setPosting(false)
    }
  }

  const handleUpdate = async (tweetId) => {
    if (!editingContent.trim()) return
    try {
      const response = await updateTweet(tweetId, editingContent)
      setTweets((prev) =>
        prev.map((t) => (t._id === tweetId ? response.data.data : t))
      )
      setEditingId(null)
      setEditingContent("")
      toast.success("Tweet updated!")
    } catch (err) {
      toast.error("Failed to update tweet")
    }
  }

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return
    try {
      await deleteTweet(tweetId)
      setTweets((prev) => prev.filter((t) => t._id !== tweetId))
      toast.success("Tweet deleted")
    } catch (err) {
      toast.error("Failed to delete tweet")
    }
  }
  const handleTweetLike = async (tweetId) => {
  if (!isAuthenticated) {
    navigate("/login")
    return
  }

  try {
    const response = await toggleTweetLike(tweetId)
    const liked = response.data.data.liked

    setTweets((prev) =>
      prev.map((tweet) =>
        tweet._id === tweetId
          ? {
              ...tweet,
              isLiked: liked,
              likesCount: Math.max(
                (tweet.likesCount || 0) + (liked ? 1 : -1),
                0
              ),
            }
          : tweet
      )
    )
  } catch (error) {
    console.log(error?.response?.data?.message || "Failed to like tweet")
  }
}

  return (
    <MainLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle size={28} />
          {username ? `@${username}` : "Tweets"}
        </h1>

        {/* Compose Tweet */}
        {isAuthenticated && !username && (
          <form onSubmit={handlePost} className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex gap-3">
              <img
                src={currentUser?.avatar}
                alt="you"
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full border-0 focus:outline-none resize-none text-lg"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-500">
                    {content.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={posting || !content.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full disabled:opacity-50"
                  >
                    <Send size={16} />
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {loading && <p className="text-center text-gray-500">Loading tweets...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && tweets.length === 0 && (
          <div className="text-center py-20">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">No tweets yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to share something!
            </p>
          </div>
        )}

        {/* Tweets List */}
        <div className="space-y-4">
          {tweets.map((tweet) => {
            const isOwner = tweet.owner?._id === currentUser?._id
            const isEditing = editingId === tweet._id

            return (
              <div
                key={tweet._id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={tweet.owner?.avatar}
                    alt={tweet.owner?.username}
                    onClick={() => navigate(`/channel/${tweet.owner?.username}`)}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => navigate(`/channel/${tweet.owner?.username}`)}
                        className="font-semibold cursor-pointer hover:underline"
                      >
                        {tweet.owner?.fullname || tweet.owner?.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{tweet.owner?.username}
                      </span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-500">
                        {new Date(tweet.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="mt-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdate(tweet._id)}
                            className="px-3 py-1 bg-black text-white rounded-full text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditingContent("")
                            }}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 whitespace-pre-wrap text-gray-800">
                        {tweet.content}
                      </p>
                    )}

                
                    {!isEditing && (
                      <div className="flex gap-3 mt-3">
                        <button
              onClick={() => handleTweetLike(tweet._id)}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200  `}
            >
              <ThumbsUp className={`${tweet.isLiked ? "text-blue-600" : ""}
              `} size={18} />
              {tweet.likesCount || 0}

            
            </button>
            {isOwner && (
                       <>
                        <button
                          onClick={() => {
                            setEditingId(tweet._id)
                            setEditingContent(tweet.content)
                          }}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tweet._id)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        </>
            )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
}

export default Tweets
