import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  Lightbulb,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function Sidebar({ isOpen }) {
  const navigate = useNavigate()
  const menuItems = [
    { icon: Home, label: "Home" },
    { icon: Compass, label: "Explore" },
    { icon: PlaySquare, label: "Subscriptions" , path:"/subscriptions" },
  ]


  const libraryItems = [
    { icon: Clock, label: "History" ,path:"/history"},
    { icon: PlaySquare, label: "Your videos",path:"/my-videos" },
    { icon: Clock, label: "Watch later" },
    { icon: ThumbsUp, label: "Liked videos" , path:"/liked-videos" },
  ]


  const exploreItems = [
    { icon: Flame, label: "Trending" },
    { icon: Music, label: "Music" },
    { icon: Gamepad2, label: "Gaming" },
    { icon: Trophy, label: "Sports" },
    { icon: Lightbulb, label: "Learning" },
  ]


  const renderItems = (items) => {

    return items.map((item) => (

      <button
        key={item.label}
        onClick={()=> item.path && navigate(item.path)}
        className="w-full flex items-center gap-6 px-6 py-3 hover:bg-gray-100 transition-colors"
      >

        <item.icon size={24} />

        {isOpen && (
          <span>{item.label}</span>
        )}

      </button>

    ))
  }


  return (

    <aside
      className={`fixed left-0 top-14 bottom-0 bg-white overflow-y-auto transition-all duration-300 ${
        isOpen ? "w-60" : "w-20"
      } border-r border-gray-200 z-40`}
    >

      <div className="py-2">

        {renderItems(menuItems)}

      </div>



      {isOpen && (

        <>

          {/* Library */}
          <div className="border-t border-gray-200 py-2">

            <div className="px-6 py-2 text-sm font-semibold text-gray-700">

              Library

            </div>

            {renderItems(libraryItems)}

          </div>



          {/* Explore */}
          <div className="border-t border-gray-200 py-2">

            <div className="px-6 py-2 text-sm font-semibold text-gray-700">

              Explore

            </div>

            {renderItems(exploreItems)}

          </div>

        </>

      )}

    </aside>
  )
}

export default Sidebar