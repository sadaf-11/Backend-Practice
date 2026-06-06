import api from "./axios.js"

export const getWatchHistory = () => {
  return api.get("/users/history")
}