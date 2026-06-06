import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header.jsx"
import { publishVideo } from "../api/videoApi.js"

function UploadVideo() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

 const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !description.trim() || !videoFile || !thumbnail) {
      setError("All fields are required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("videoFile", videoFile)
    formData.append("thumbnail", thumbnail)

    try {
      setLoading(true)

      const response = await publishVideo(formData)
      const uploadedVideo = response.data.data

      navigate(`/watch/${uploadedVideo._id}`)
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to upload video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload video</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600">
              {error}
            </p>
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
              placeholder="Enter video title"
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
              placeholder="Enter video description"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Video file
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Thumbnail
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
            disabled={loading}
            className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default UploadVideo