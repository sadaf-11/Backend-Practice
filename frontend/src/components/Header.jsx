import { useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {logout} from "../store/authSlice.js"
import { Bell, Menu, Search, User, Video } from "lucide-react"


function Header({ onMenuClick }) {
  const [search, setSearch] = useState("")
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {isAuthenticated,user}=useSelector((state)=>state.auth)


 const handleSearch = () => {
  const trimmedSearch = search.trim()

  if (!trimmedSearch) {
    navigate("/")
    return
  }

  navigate(`/?query=${encodeURIComponent(trimmedSearch)}`)
}

  const handleLogout=async()=>{
    await dispatch(logout()).unwrap().then(()=>{
    navigate("/")
    }).catch((error)=>{
        console.log("Logout failed:", error)
    })
  }


  return (

    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 z-50">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu size={24} />
      </button>


      <div 
      onClick={()=>navigate("/")}
      className="flex items-center gap-1 cursor-pointer">
        <Video
          size={28}
          className="text-red-600"
        />
        <span className="font-bold text-xl">
          ViewTube
        </span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto">
        <div className="flex items-center">

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch()
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>



      {/* Right Icons */}
      <div className="flex items-center gap-3">

       {isAuthenticated ? (
        <>
        <button 
        onClick={()=>navigate("/upload")}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video size={24} />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={24} />
            </button>

            {user?.avatar ? (
              <img 
              src={user.avatar}
              alt={user.username}
              onClick={() => navigate("/settings")}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              // onClick={()=>navigate(`/channel/${user._id}`)}
              />
            ):(
              <User size={24} className="text-gray-600 cursor-pointer" />
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              Logout
            </button>
        </>
       ):(
        <>
        <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 hover:bg-gray-100 rounded-full"
            >
              Login
            </button>
             <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-black text-white rounded-full"
            >
              Sign up
            </button>
        </>
       )}

      </div>

    </header>
  )
}

export default Header