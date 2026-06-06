import api from "./axios.js";

export const toggleSubscription=(channelId)=>{
    return api.post(`/subscription/${channelId}`)
}

export const getSubscribedChannels = (subscriberId) => {
  return api.get(`/subscription/subscribed-channels/${subscriberId}`)
}