import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { addVideoComment, getVideoComments,deleteVideoComment,updateVideoComment } from "../api/commentApi.js"
function Comments({videoId}){
    const navigate=useNavigate()
    const {isAuthenticated,user}=useSelector((state)=>state.auth)


    const [comments,setComments]=useState([])
    const [content,setContent]=useState("")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editingContent, setEditingContent] = useState("")
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")


    useEffect(()=>{
        const fetchComments=async()=>{
            try{
                const response=await getVideoComments(videoId)
                setComments(response.data.data.docs || [])
            } catch (error) {
        setError(error?.response?.data?.message || "Failed to load comments")
      } finally {
        setLoading(false)
            }
        }
        fetchComments()

    },[videoId])


    const addComment=async(e)=>{
        e.preventDefault()
        if(!isAuthenticated){
            navigate("/login")
            return 
        }
        if(!content.trim()){
            return
        }
        try{
            const response=await addVideoComment(videoId,content)
            setComments((prev)=>[
                response.data.data,
                ...prev,
                
            ])
            setContent("")
        } catch (error) {
            console.log(error?.response?.data?.message || "Failed to add comment")
            
        }
    }

    const handleStartEdit = (comment) => {
  setEditingCommentId(comment._id)
  setEditingContent(comment.content)
}

const handleCancelEdit = () => {
  setEditingCommentId(null)
  setEditingContent("")
}

const handleUpdateComment = async (commentId) => {
  if (!editingContent.trim()) {
    return
  }

  try {
    const response = await updateVideoComment(
      videoId,
      commentId,
      editingContent
    )

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, content: response.data.data.content }
          : comment
      )
    )

    handleCancelEdit()
  } catch (error) {
    console.log(error?.response?.data?.message || "Failed to update comment")
  }
}

const handleDeleteComment = async (commentId) => {
  const confirmDelete = window.confirm("Delete this comment?")

  if (!confirmDelete) {
    return
  }

  try {
    await deleteVideoComment(videoId, commentId)

    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    )
  } catch (error) {
    console.log(error?.response?.data?.message || "Failed to delete comment")
  }
}

return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <form onSubmit={addComment} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="px-5 py-2 bg-black text-white rounded-full"
        >
          Comment
        </button>
      </form>

      {loading && <p>Loading comments...</p>}

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {comments.map((comment) => {
  const ownerId = comment.owner?._id || comment.owner
  const isOwner = user?._id === ownerId
  const isEditing = editingCommentId === comment._id

  return (
    <div key={comment._id} className="flex gap-3">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-9 h-9 rounded-full object-cover bg-gray-300"
      />

      <div className="flex-1">
        <p className="font-semibold text-sm">
          {comment.owner?.fullname || comment.owner?.username || "User"}
        </p>

        {isEditing ? (
          <div className="mt-2">
            <input
              type="text"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleUpdateComment(comment._id)}
                className="px-3 py-1 bg-black text-white rounded-full"
              >
                Save
              </button>

              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-100 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800">
            {comment.content}
          </p>
        )}

        {isOwner && !isEditing && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleStartEdit(comment)}
              className="text-sm text-gray-600 hover:text-black"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
})}
      </div>
    </section>
  )
}

export default Comments
