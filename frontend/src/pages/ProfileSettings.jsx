import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "../store/authSlice.js"
import Header from "../components/Header.jsx"
// import Sidebar from "../components/Sidebar.jsx"
import {
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../api/userApi.js"


function ProfileSettings() {
    const dispatch = useDispatch()

    const {user}=useSelector((state)=>state.auth)

    const [fullname, setFullname] = useState(user?.fullname || "")
  const [email, setEmail] = useState(user?.email || "")
  const [username, setUsername] = useState(user?.username || "")
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleAccountUpdate=async(e)=>{
    e.preventDefault()
    setMessage("")
    setError("")
    try{
        setSaving(true)

        await updateAccountDetails({
            fullname,
            email,
            username
        })
        dispatch(fetchCurrentUser())
         setMessage("Account updated successfully")
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update account")
    } finally {
      setSaving(false)
    }
    }

    const handleAvatarUpdate=async(e)=>{
        e.preventDefault()
        setMessage("")
        setError("")
        if (!avatar) {
            setError("Please select an avatar")
            return
        }
        const formData=new FormData()
        formData.append("avatar",avatar)
        try {
      setSaving(true)
      await updateAvatar(formData)
      dispatch(fetchCurrentUser())
      setMessage("Avatar updated successfully")
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update avatar")
    } finally {
      setSaving(false)
    }
    }

    const handleCoverUpdate = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!coverImage) {
      setError("Please select a cover image")
      return
    }

    const formData = new FormData()
    formData.append("coverImage", coverImage)

    try {
      setSaving(true)
      await updateCoverImage(formData)
      dispatch(fetchCurrentUser())
      setMessage("Cover image updated successfully")
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update cover image")
    } finally {
      setSaving(false)
    }
  }
  return (
    <main className="min-h-screen bg-white">
      <Header  />

      <section className="pt-20 px-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile settings</h1>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleAccountUpdate} className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Account details</h2>

          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-black text-white rounded-full"
          >
            Save account
          </button>
        </form>

        <form onSubmit={handleAvatarUpdate} className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Avatar</h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-black text-white rounded-full"
          >
            Update avatar
          </button>
        </form>

        <form onSubmit={handleCoverUpdate} className="space-y-4">
          <h2 className="text-xl font-semibold">Cover image</h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-black text-white rounded-full"
          >
            Update cover
          </button>
        </form>
      </section>
    </main>
  )
}

export default ProfileSettings

