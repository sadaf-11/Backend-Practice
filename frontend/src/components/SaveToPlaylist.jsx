import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { X, Plus, Check, ListVideo, Clock } from "lucide-react"
import toast from "react-hot-toast"
import {
  getUserPlaylists,
  getWatchLater,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../api/playlistApi.js"

function SaveToPlaylist({ videoId, onClose }) {
  const { user } = useSelector((state) => state.auth)

  const [playlists, setPlaylists] = useState([])
  const [watchLaterId, setWatchLaterId] = useState(null)
  const [isInWatchLater, setIsInWatchLater] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [creating, setCreating] = useState(false)
  const [videoInPlaylists, setVideoInPlaylists] = useState(new Set())

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const [watchLaterResponse, playlistsResponse] = await Promise.all([
          getWatchLater(),
          getUserPlaylists(user._id),
        ])

        const watchLater = watchLaterResponse.data.data
        const list = playlistsResponse.data.data || []

        setWatchLaterId(watchLater._id)
        setIsInWatchLater(
          watchLater.videos?.some((v) => v._id === videoId || v === videoId)
        )
        setPlaylists(list)

        const inPlaylists = new Set()
        list.forEach((pl) => {
          if (pl.videos?.some((v) => v._id === videoId || v === videoId)) {
            inPlaylists.add(pl._id)
          }
        })
        setVideoInPlaylists(inPlaylists)
      } catch (err) {
        toast.error("Failed to load playlists")
      } finally {
        setLoading(false)
      }
    }
    if (user?._id) fetchPlaylists()
  }, [user, videoId])

  const handleToggleWatchLater = async () => {
    if (!watchLaterId) return

    try {
      if (isInWatchLater) {
        await removeVideoFromPlaylist(watchLaterId, videoId)
        setIsInWatchLater(false)
        toast.success("Removed from Watch Later")
      } else {
        await addVideoToPlaylist(watchLaterId, videoId)
        setIsInWatchLater(true)
        toast.success("Saved to Watch Later")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update Watch Later")
    }
  }

  const handleTogglePlaylist = async (playlistId) => {
    const isInPlaylist = videoInPlaylists.has(playlistId)
    try {
      if (isInPlaylist) {
        await removeVideoFromPlaylist(playlistId, videoId)
        setVideoInPlaylists((prev) => {
          const next = new Set(prev)
          next.delete(playlistId)
          return next
        })
        toast.success("Removed from playlist")
      } else {
        await addVideoToPlaylist(playlistId, videoId)
        setVideoInPlaylists((prev) => new Set(prev).add(playlistId))
        toast.success("Added to playlist")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update playlist")
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    try {
      setCreating(true)
      const response = await createPlaylist(newName, newDescription)
      const newPlaylist = response.data.data
      setPlaylists((prev) => [newPlaylist, ...prev])
      setNewName("")
      setNewDescription("")
      setShowCreateForm(false)
      toast.success("Playlist created")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create playlist")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ListVideo size={20} />
            Save to playlist
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Create new playlist form */}
        {showCreateForm ? (
          <form onSubmit={handleCreatePlaylist} className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Playlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
              required
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-black text-white rounded-full text-sm disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-200"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="font-medium">Create new playlist</span>
          </button>
        )}

        <button
          onClick={handleToggleWatchLater}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left border-b border-gray-200"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">Watch Later</p>
            <p className="text-xs text-gray-500">Save to watch later</p>
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              isInWatchLater
                ? "bg-black text-white"
                : "border-2 border-gray-300"
            }`}
          >
            {isInWatchLater && <Check size={14} />}
          </div>
        </button>

        {/* Existing playlists */}
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : playlists.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No playlists yet. Create one above.
          </div>
        ) : (
          <div>
            {playlists.map((playlist) => {
              const isInPlaylist = videoInPlaylists.has(playlist._id)
              return (
                <button
                  key={playlist._id}
                  onClick={() => handleTogglePlaylist(playlist._id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                    <ListVideo size={18} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    {playlist.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {playlist.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isInPlaylist
                        ? "bg-black text-white"
                        : "border-2 border-gray-300"
                    }`}
                  >
                    {isInPlaylist && <Check size={14} />}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SaveToPlaylist
