import api from "./axios.js"

// Create a tweet
export const createTweet = (content) => {
  return api.post("/tweets", { content })
}

// Update a tweet
export const updateTweet = (tweetId, content) => {
  return api.patch(`/tweets/${tweetId}`, { content })
}

// Delete a tweet
export const deleteTweet = (tweetId) => {
  return api.delete(`/tweets/${tweetId}`)
}

// Get tweets by user
export const getUserTweets = (userId) => {
  return api.get(`/tweets/users/${userId}`)
}

export const getAllTweets = () => {
  return api.get("/tweets")
}