import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { User, Lock, Image as ImageIcon, Camera } from "lucide-react"
import MainLayout from "../layouts/MainLayout.jsx"
import { fetchCurrentUser } from "../store/authSlice.js"
import toast from "react-hot-toast"

import {
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword
} from "../api/userApi.js"

function ProfileSettings() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Account details state
  const [fullname, setFullname] = useState(user?.fullname || "")
  const [email, setEmail] = useState(user?.email || "")
  const [username, setUsername] = useState(user?.username || "")

  // Password state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // File state
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)

  // UI state
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const clearMessages = () => {
    setMessage("")
    setError("")
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleAccountUpdate = async (e) => {
    e.preventDefault()
    clearMessages()
    try {
      setSaving(true)
      await updateAccountDetails({ fullname, email, username })
      dispatch(fetchCurrentUser())
      setMessage("Account updated successfully")
      toast.success("Account updated successfully!")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update account")
      setError(err?.response?.data?.message || "Failed to update account")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    clearMessages()

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      setSaving(true)
      await changePassword({ oldPassword, newPassword, confirmPassword })
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("Password changed successfully")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password")
      setError(err?.response?.data?.message || "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpdate = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!avatar) {
      setError("Please select an avatar")
      return
    }

    const formData = new FormData()
    formData.append("avatar", avatar)

    try {
      setSaving(true)
      await updateAvatar(formData)
      dispatch(fetchCurrentUser())
      setMessage("Avatar updated successfully")
      setAvatar(null)
      setAvatarPreview(null)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update avatar")
    } finally {
      setSaving(false)
    }
  }

  const handleCoverUpdate = async (e) => {
    e.preventDefault()
    clearMessages()
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
      setCoverImage(null)
      setCoverPreview(null)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update cover image")
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "avatar", label: "Avatar", icon: Camera },
    { id: "cover", label: "Cover", icon: ImageIcon },
  ]

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Profile settings</h1>
        <p className="text-gray-600 mb-6">Manage your account settings</p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  clearMessages()
                }}
                className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Account Tab */}
        {activeTab === "account" && (
          <form onSubmit={handleAccountUpdate} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Full name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Current password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {saving ? "Changing..." : "Change password"}
            </button>
          </form>
        )}

        {/* Avatar Tab */}
        {activeTab === "avatar" && (
          <form onSubmit={handleAvatarUpdate} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Current avatar</label>
              <img
                src={user?.avatar}
                alt="Current avatar"
                className="w-32 h-32 rounded-full object-cover bg-gray-200"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">New avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="mt-3 w-32 h-32 rounded-full object-cover"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {saving ? "Uploading..." : "Update avatar"}
            </button>
          </form>
        )}

        {/* Cover Tab */}
        {activeTab === "cover" && (
          <form onSubmit={handleCoverUpdate} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Current cover</label>
              {user?.coverImage ? (
                <img
                  src={user.coverImage}
                  alt="Current cover"
                  className="w-full h-40 object-cover rounded-xl bg-gray-200"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl" />
              )}
            </div>
            <div>
              <label className="block font-medium mb-2">New cover image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Preview"
                  className="mt-3 w-full h-40 object-cover rounded-xl"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-60"
            >
              {saving ? "Uploading..." : "Update cover"}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  )
}

export default ProfileSettings
