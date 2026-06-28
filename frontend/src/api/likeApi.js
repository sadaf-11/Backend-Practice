import api from "./axios";

export const toggleVideoLike=(videoId)=>{
    return api.post(`/likes/videos/${videoId}`)
}
export const getLikedVideos = (userId) => {
  return api.get(`/likes/users/${userId}/videos`)
}
export const toggleTweetLike = (tweetId) => {
  return api.post(`/likes/tweets/${tweetId}`)
}
export const toggleCommentLike = (commentId) => {
  return api.post(`/likes/comments/${commentId}`)
}