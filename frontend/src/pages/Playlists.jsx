import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Trash2, ListVideo } from "lucide-react"
import toast from "react-hot-toast"
import MainLayout from "../layouts/MainLayout.jsx"
import VideoGrid from "../components/VideoGrid.jsx"
import {
  getUserPlaylists,
  deletePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
} from "../api/playlistApi.js"
function Playlists() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlistVideos, setPlaylistVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getUserPlaylists(user._id)
        setPlaylists(response.data.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load playlists")
      } finally {
        setLoading(false)
      }
    }
    if (user?._id) fetchPlaylists()
  }, [user])

  const handleOpenPlaylist = async (playlistId) => {
    try {
      const response = await getPlaylistById(playlistId)
      const data = response.data.data
      setSelectedPlaylist(data)
      setPlaylistVideos(data.videos || [])
    } catch (err) {
      toast.error("Failed to open playlist")
    }
  }

  const handleDelete = async (playlistId) => {
    if (!window.confirm("Delete this playlist?")) return
    try {
      await deletePlaylist(playlistId)
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId))
      if (selectedPlaylist?._id === playlistId) {
        setSelectedPlaylist(null)
        setPlaylistVideos([])
      }
      toast.success("Playlist deleted")
    } catch (err) {
      toast.error("Failed to delete playlist")
    }
  }

  const handleRemoveVideo = async (videoId) => {
    if (!selectedPlaylist?._id) return
    if (!window.confirm("Remove this video from the playlist?")) return

    const remainingVideos = playlistVideos.filter((v) => v._id !== videoId)
    const removedWasFirst = playlistVideos[0]?._id === videoId

    try {
      await removeVideoFromPlaylist(selectedPlaylist._id, videoId)
      setPlaylistVideos(remainingVideos)
      setSelectedPlaylist((prev) =>
        prev
          ? {
              ...prev,
              videos: prev.videos?.filter(
                (v) => (v._id || v).toString() !== videoId
              ),
            }
          : prev
      )
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === selectedPlaylist._id
            ? {
                ...p,
                videoCount: remainingVideos.length,
                firstVideoThumbnail: removedWasFirst
                  ? remainingVideos[0]?.thumbnail || null
                  : p.firstVideoThumbnail,
              }
            : p
        )
      )
      toast.success("Removed from playlist")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove video")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading playlists...</div>
      </MainLayout>
    )
  }

  // If a playlist is selected, show its videos
  if (selectedPlaylist) {
    return (
      <MainLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <button
            onClick={() => {
              setSelectedPlaylist(null)
              setPlaylistVideos([])
            }}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to playlists
          </button>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ListVideo size={28} />
                {selectedPlaylist.name}
              </h1>
              {selectedPlaylist.description && (
                <p className="text-gray-600 mt-1">{selectedPlaylist.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {playlistVideos.length} videos
              </p>
            </div>
          </div>

          <VideoGrid
            videos={playlistVideos}
            loading={false}
            error=""
            emptyMessage="No videos in this playlist"
            onRemoveVideo={handleRemoveVideo}
          />
        </div>
      </MainLayout>
    )
  }

  // Default view: list of playlists
  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
        </div>

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {playlists.length === 0 && !loading ? (
          <div className="text-center py-20">
            <ListVideo size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-2">No playlists yet</p>
            <p className="text-sm text-gray-400 mb-4">
              You can create playlists from any video's watch page
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-black text-white rounded-full"
            >
              Browse videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  onClick={() => handleOpenPlaylist(playlist._id)}
                  className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {playlist.firstVideoThumbnail ? (
                    <img
                      src={playlist.firstVideoThumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ListVideo size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => handleOpenPlaylist(playlist._id)}
                      className="flex-1 cursor-pointer"
                    >
                      <h3 className="font-semibold">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {playlist.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {playlist.videoCount || 0} videos
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="p-2 hover:bg-red-50 rounded-full text-red-600"
                      title="Delete playlist"
                    >
                      <Trash2 size={16} />
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

export default Playlists
