import { useState } from "react"
import Header from "../components/Header.jsx"
import Sidebar from "../components/Sidebar.jsx"

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev)
    } else {
      setIsSidebarOpen((prev) => !prev)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header onMenuClick={handleMenuClick} />

      <div className="flex pt-14">
        {/* Desktop Sidebar (always visible, collapsible) */}
        <div className="hidden md:block">
          <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(true)} />
        </div>

        {/* Mobile Sidebar (overlay) */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-14 bottom-0 z-40">
              <Sidebar isOpen={true} onNavigate={() => setIsMobileSidebarOpen(false)}/>
            </div>
          </>
        )}

        <section
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-60" : "md:ml-20"
          } ml-0`}
        >
          {children}
        </section>
      </div>
    </main>
  )
}

export default MainLayout
