import api from "./axios.js"

export const getChannelStats = (channelId) => {
  return api.get(`/dashboard/channel-statistics/${channelId}`)
}

export const getChannelVideos = (channelId) => {
  return api.get(`/dashboard/channel-videos/${channelId}`)
}