import api from "./axios.js"

export const getUserChannelProfile = (username) => {
  return api.get(`/users/c/${username}`)
}
export const updateAccountDetails = (data) => {
  return api.patch("/users/update-account", data)
}

export const updateAvatar = (formData) => {
  return api.patch("/users/update-avatar", formData)
}

export const updateCoverImage = (formData) => {
  return api.patch("/users/update-coverImage", formData)
}

export const changePassword=(data)=>{
  return api.post("/users/change-password",data)
}