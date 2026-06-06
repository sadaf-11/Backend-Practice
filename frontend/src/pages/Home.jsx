import { useEffect,useState } from "react"
import Header from "../components/Header.jsx"
import Sidebar from "../components/Sidebar.jsx"
import VideoCard from "../components/Videocard.jsx"
import { getAllVideos } from "../api/videoApi.js"
import { useSearchParams } from "react-router-dom"

function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""
  const [videos,setVideos]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(()=>{
    const fetchVideos=async()=>{
      try {
        setLoading(true)
        setError("")
        const response=await getAllVideos(query)
        setVideos(response.data.data.docs || [])
      } catch (error) {
        setError(error?.response?.data?.message || "failed to load videos")
      }finally{
        setLoading(false)
      }
    }
    fetchVideos()
  },[query])

 return (
    <main className="min-h-screen bg-white">
      <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex pt-14">
        <Sidebar isOpen={isSidebarOpen} />

        <section
        
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-60" : "ml-20"
          }`}
          
        >
          {query && (
            <h1 className="text-xl font-bold mb-4">
              Search results for "{query}"
            </h1>
          )}
          {loading && <p>Loading videos...</p>}
          {error && <p>{error}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
