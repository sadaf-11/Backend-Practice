import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout.jsx"
import { getVideoById, updateVideo } from "../api/videoApi.js"
import toast from "react-hot-toast"
import { updateVideoFile } from "../api/videoApi.js"



function EditVideo() {
  const { videoId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState("")
  const [videoFile, setVideoFile] = useState(null)
const [updatingFile, setUpdatingFile] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId)
        const video = response.data.data
        setTitle(video.title || "")
        setDescription(video.description || "")
        setCurrentThumbnail(video.thumbnail || "")
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load video")
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId])

  const handleFileUpdate = async (e) => {
  e.preventDefault()
  if (!videoFile) return
  
  const formData = new FormData()
  formData.append("videoFile", videoFile)
  
  try {
    setUpdatingFile(true)
    await updateVideoFile(videoId, formData)
    toast.success("Video file updated!")
    setVideoFile(null)
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update video file")
  } finally {
    setUpdatingFile(false)
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const formData = new FormData()
    if (title.trim()) formData.append("title", title)
    if (description.trim()) formData.append("description", description)
    if (thumbnail) formData.append("thumbnail", thumbnail)

    try {
      setSaving(true)
      await updateVideo(videoId, formData)
      toast.success("Video updated successfully!")
      navigate("/my-videos")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update video")
      setError(err?.response?.data?.message || "Failed to update video")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading video...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Edit video</h1>
        <p className="text-gray-600 mb-6">Update your video details</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {currentThumbnail && (
            <div>
              <label className="block font-medium mb-2">Current thumbnail</label>
              <img
                src={currentThumbnail}
                alt="Current thumbnail"
                className="w-full aspect-video object-cover rounded-xl bg-gray-200"
              />
            </div>
          )}

          <div>
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-32 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">New thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
  <label className="block font-medium mb-2">Replace video file (optional)</label>
  <input
    type="file"
    accept="video/*"
    onChange={(e) => setVideoFile(e.target.files[0])}
    className="w-full border border-gray-300 rounded-lg px-4 py-2"
  />
  {videoFile && (
    <p className="text-sm text-gray-600 mt-2">
      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
    </p>
  )}
  {videoFile && (
    <button
      type="button"
      onClick={handleFileUpdate}
      disabled={updatingFile}
      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm disabled:opacity-60"
    >
      {updatingFile ? "Uploading..." : "Replace video"}
    </button>
  )}
</div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/my-videos")}
              className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default EditVideo
