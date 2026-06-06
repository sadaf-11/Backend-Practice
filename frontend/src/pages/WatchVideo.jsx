import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { getVideoById } from "../api/videoApi.js";
import { toggleVideoLike } from "../api/likeApi.js";
import { toggleSubscription } from "../api/subscriptionApi.js";
import Header from "../components/Header.jsx";
import Comments from "../components/Comments.jsx";

function WatchVideo(){
const {videoId}=useParams()
const navigate=useNavigate()
const {isAuthenticated}=useSelector((state)=>state.auth)

  const [video, setVideo] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(()=>{
      const fetchVideo=async()=>{
        try {
          const response=await getVideoById(videoId)
          setVideo(response.data.data)
        } catch (error) {
          setError(error?.response?.data?.message || "failed to load video")
        }finally{
          setLoading(false)
        }
      }
      fetchVideo()
    },[videoId])



    const requireLogin=()=>{
        if(!isAuthenticated){
            navigate("/login")
            return false
        }
        return true
    }


    const handleLike=async()=>{
        if(!requireLogin()){
            return 
        }
     try {
        await toggleVideoLike(videoId)
        setIsLiked((prev) => !prev)
      } 
      catch (error) {
         console.log(error?.response?.data?.message || "Failed to like video")
      }
}


    const handleSubscribe=async()=>{
        if(!requireLogin()){
            return 
        }
        const channelId=video.owner?._id
        if(!channelId){
            console.log("Channel not found")
            return
        }
         try {
            await toggleSubscription(channelId)
            setIsSubscribed((prev) => !prev)
   } catch (error) {
            console.log(error?.response?.data?.message || "Failed to subscribe")
          }
    }

     if (loading) return <p>Loading video...</p>
    if (error) return <p>{error}</p>
    if (!video) return <p>Video not found</p>
return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 px-6 max-w-5xl mx-auto">
        <video
          src={video.videoFile}
          controls
          className="w-full aspect-video bg-black rounded-xl"
        />

        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>

        <div className="flex items-center justify-between mt-4">
          <div
          onClick={()=>navigate(`/channel/${video.owner?.username}`)}
           className="flex items-center gap-3 cursor-pointer">
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">
                {video.owner?.fullname || video.owner?.username}
              </p>
              <p className="text-sm text-gray-600">
                @{video.owner?.username}
              </p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className={`px-5 py-2 rounded-full ${
              isSubscribed
                ? "bg-gray-100 text-black"
                : "bg-black text-white"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-full ${
              isLiked
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>
        </div>

        <p className="mt-4 bg-gray-100 p-4 rounded-xl">
          {video.description}
        </p>

        <Comments videoId={videoId} />
      </section>
    </main>
  )
}

export default WatchVideo
