import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import { publishVideo } from "../api/videoApi.js"
import toast from "react-hot-toast"

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
      toast.success("Video uploaded successfully!")
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Upload video</h1>
        <p className="text-gray-600 mb-6">
          Share your content with the world
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter video title"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-32 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Tell viewers about your video"
            />
          </div>

          {/* Video File */}
          <div>
            <label className="block font-medium mb-2">Video file *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer block">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">
                  {videoFile ? videoFile.name : "Click to select video file"}
                </p>
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block font-medium mb-2">Thumbnail *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail preview"
                    className="max-h-32 mx-auto rounded"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                      Click to select thumbnail image
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default UploadVideo
