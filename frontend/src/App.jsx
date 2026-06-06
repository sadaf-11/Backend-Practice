import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { fetchCurrentUser } from "./store/authSlice.js"
import WatchVideo from "./pages/WatchVideo.jsx"
import UploadVideo from "./pages/UploadVideo.jsx"
import MyVideos from "./pages/MyVdeos.jsx"
import EditVideo from "./pages/EditVideo.jsx"
import Channel from "./pages/Channel.jsx"
import WatchHistory from "./pages/WatchHistory.jsx"
import LikedVideos from "./pages/LikedVideos.jsx"
import Subscriptions from "./pages/Subscriptions.jsx"
import ProfileSettings from "./pages/ProfileSettings.jsx"

function App() {
   const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/watch/:videoId" element={<WatchVideo />} />
        <Route path="/channel/:username" element={<Channel />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-videos"
          element={
            <ProtectedRoute>
              <MyVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-video/:videoId"
          element={
            <ProtectedRoute>
              <EditVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <WatchHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-videos"
          element={
            <ProtectedRoute>
              <LikedVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App