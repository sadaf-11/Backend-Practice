import api from "./axios.js"

// Create a new playlist
export const createPlaylist = (name, description) => {
  return api.post("/playlist", { name, description })
}

// Get all playlists for a user
export const getUserPlaylists = (userId) => {
  return api.get(`/playlist/user/${userId}`)
}

// Get watch later playlist (creates if missing)
export const getWatchLater = () => {
  return api.get("/playlist/watch-later")
}

// Get a single playlist by ID
export const getPlaylistById = (playlistId) => {
  return api.get(`/playlist/${playlistId}`)
}

// Update playlist details
export const updatePlaylist = (playlistId, data) => {
  return api.patch(`/playlist/${playlistId}`, data)
}

// Delete a playlist
export const deletePlaylist = (playlistId) => {
  return api.delete(`/playlist/${playlistId}`)
}

// Add a video to a playlist
export const addVideoToPlaylist = (playlistId, videoId) => {
  return api.post(`/playlist/${playlistId}/videos/${videoId}`)
}

// Remove a video from a playlist
export const removeVideoFromPlaylist = (playlistId, videoId) => {
  return api.delete(`/playlist/${playlistId}/videos/${videoId}`)
}
