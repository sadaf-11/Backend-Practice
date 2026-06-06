import api from "./axios";

export const getAllVideos=(query = "")=>{
    const params=query ? { query } : {}
    return api.get("/videos",{ params })
}
export const getVideoById=(videoId)=>{
    return api.get(`/videos/${videoId}`)
}

export const publishVideo=(formData)=>{
    return api.post("/videos/publish-video",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
}

export const getUserVideos=(userId)=>{
    return api.get(`/videos?userId=${userId}`)
}
export const updateVideo = (videoId, formData) => {
  return api.patch(`/videos/${videoId}`, formData)
}

export const deleteVideo = (videoId) => {
  return api.delete(`/videos/${videoId}`)
}

export const togglePublishStatus = (videoId) => {
  return api.get(`/videos/toggle/publish/${videoId}`)
}
