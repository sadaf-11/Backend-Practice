import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/Header.jsx"
import { getVideoById, updateVideo } from "../api/videoApi.js"

function EditVideo() {
  const { videoId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState("")
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
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load video")
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [videoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const formData = new FormData()

    if (title.trim()) {
      formData.append("title", title)
    }

    if (description.trim()) {
      formData.append("description", description)
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail)
    }

    try {
      setSaving(true)
      await updateVideo(videoId, formData)
      navigate("/my-videos")
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update video")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading video...</p>
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit video</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-600">{error}</p>}

          {currentThumbnail && (
            <img
              src={currentThumbnail}
              alt="Current thumbnail"
              className="w-full aspect-video object-cover rounded-xl bg-gray-200"
            />
          )}

          <div>
            <label className="block font-medium mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              New thumbnail
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default EditVideo