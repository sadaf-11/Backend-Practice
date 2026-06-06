import {useEffect, useState} from "react"
import {login } from "../store/authSlice.js"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

function Login(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {loading,error,isAuthenticated}=useSelector((state)=>state.auth)

    const [formData,setFormData]=useState({
        email:"",
        password:"",
    })

    const handleChange=(e)=>{
        setFormData((prev)=>({
            ...prev,
          [e.target.name]:e.target.value,
        }))
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        dispatch(login(formData))
    }

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/")
        }
    },[isAuthenticated,navigate])

return (
  <main className="min-h-screen bg-white flex items-center justify-center">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm border border-gray-200 rounded-xl p-6 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="enter email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="enter password"
        value={formData.password}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </main>
)
}

export default Login
