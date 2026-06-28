import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ThumbsUp, ThumbsDown, Share2, Download,ListPlus  } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import Comments from "../components/Comments.jsx"
import { getVideoById } from "../api/videoApi.js"
import { toggleVideoLike } from "../api/likeApi.js"
import { toggleSubscription } from "../api/subscriptionApi.js"
import toast from "react-hot-toast"
import SaveToPlaylist from "../components/SaveToPlaylist.jsx"


function WatchVideo() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [video, setVideo] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await getVideoById(videoId)
        const videoData = response.data.data
        setVideo(videoData)
        setIsLiked(!!videoData.isLiked)
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load video")
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId])

  const requireLogin = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return false
    }
    return true
  }

  const handleLike = async () => {
    if (!requireLogin()) return
    try {
      const response = await toggleVideoLike(videoId)
      const liked = response.data.data.liked
      setIsLiked(liked)
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              isLiked: liked,
              likesCount: Math.max(
                (prev.likesCount || 0) + (liked ? 1 : -1),
                0
              ),
            }
          : prev
      )
      toast.success(liked ? "Liked!" : "Removed like")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to like video")
    }
  }

  const handleSubscribe = async () => {
    if (!requireLogin()) return
    const channelId = video.owner?._id
    if (!channelId) return
    try {
      await toggleSubscription(channelId)
      setIsSubscribed((prev) => !prev)
      toast.success(isSubscribed ? "Unsubscribed" : "Subscribed!")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to subscribe")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading video...</div>
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

  if (!video) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Video not found</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>

        {/* Channel + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div
            onClick={() => navigate(`/channel/${video.owner?.username}`)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-12 h-12 rounded-full object-cover bg-gray-300"
            />
            <div>
              <p className="font-semibold">
                {video.owner?.fullname || video.owner?.username}
              </p>
              <p className="text-sm text-gray-600">
                @{video.owner?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                isSubscribed
                  ? "bg-gray-100 text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Like / Share Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex bg-gray-100 rounded-full overflow-hidden">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200  `}>
              <ThumbsUp className={`${video.isLiked ? "text-blue-600" : ""}
              `} size={18} />
              {video.likesCount || 0}
             
            
            </button>
            <div className="w-px bg-gray-300 my-1" />
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200">
              <ThumbsDown size={18} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Share2 size={18} />
            <span>Share</span>
          </button>

          <a
            href={video.videoFile}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Download size={18} />
            <span>Download</span>
          </a>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ListPlus size={18} />   {/* or use Bookmark icon */}
            <span>Save</span>
          </button>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-100 p-4 rounded-xl">
          <div className="flex gap-4 text-sm font-semibold mb-2">
            <span>{video.views || 0} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="whitespace-pre-wrap text-gray-800">
            {video.description}
          </p>
        </div>

        {/* Comments */}
        <Comments videoId={videoId} />
      </div>
      {showSaveModal && (
        <SaveToPlaylist
          videoId={videoId}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </MainLayout>
  )
}

export default WatchVideo
