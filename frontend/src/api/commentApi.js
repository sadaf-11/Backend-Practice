import api from "./axios";

export const getVideoComments=(videoId)=>{
    return api.get(`/comments/${videoId}`)
}
export const addVideoComment=(videoId,content)=>{
    return api.post(`/comments/${videoId}`,{ content })
}
export const updateVideoComment = (videoId, commentId, content) => {
  return api.patch(`/comments/${videoId}/${commentId}`, { content })
}

export const deleteVideoComment = (videoId, commentId) => {
  return api.delete(`/comments/${videoId}/${commentId}`)
}