import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice.js"
import { Bell, Menu, Search, User, Video, X } from "lucide-react"

function Header({ onMenuClick }) {
  const [search, setSearch] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleSearch = () => {
    const trimmedSearch = search.trim()
    if (!trimmedSearch) {
      navigate("/")
      return
    }
    navigate(`/?query=${encodeURIComponent(trimmedSearch)}`)
    setShowMobileSearch(false)
    setSearch("")
  }

  const handleLogout = async () => {
    await dispatch(logout())
      .unwrap()
      .then(() => navigate("/"))
      .catch((error) => console.log("Logout failed:", error))
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 gap-2 sm:gap-4 z-50">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu size={24} />
      </button>

      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-1 cursor-pointer"
      >
        <Video size={28} className="text-red-600" />
        <span className="font-bold text-xl ">ViewTube</span>
      </div>

      {/* Desktop/Tablet Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-2xl mx-auto">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
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
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setShowMobileSearch((prev) => !prev)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Search size={22} />
        </button>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/upload")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Video size={24} />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Bell size={24} />
            </button>

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                onClick={() => navigate("/settings")}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <User size={24} className="text-gray-600 cursor-pointer" />
            )}

           <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs sm:text-sm"
          >
            Logout
          </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 sm:px-4 py-2 hover:bg-gray-100 rounded-full text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-full text-sm"
            >
              Sign up
            </button>
          </>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-3 flex items-center gap-2 z-50">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            autoFocus
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => {
              setShowMobileSearch(false)
              setSearch("")
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
