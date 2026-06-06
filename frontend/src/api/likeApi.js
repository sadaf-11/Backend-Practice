import api from "./axios";

export const toggleVideoLike=(videoId)=>{
    return api.post(`/likes/videos/${videoId}`)
}
export const getLikedVideos = (userId) => {
  return api.get(`/likes/users/${userId}/videos`)
}