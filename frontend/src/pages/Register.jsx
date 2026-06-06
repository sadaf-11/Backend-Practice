import {useState} from "react"
import {register } from "../store/authSlice.js"
import { useNavigate } from "react-router-dom"
import { useSelector,useDispatch } from "react-redux"

function Register() {
    const dispatch=useDispatch()
    const navigate = useNavigate()
    const {loading,error}=useSelector((state)=>state.auth)

    const [formData,setFormData]=useState({
        username:"",
        fullname:"",
        email:"",
        password:"",
        avatar:null
    })

      const handleChange=(e)=>{
        const {name,value,files}=e.target
        if(name==="avatar"){
            setFormData((prev)=>({
                ...prev,
                avatar:files[0],
            }))
        }else
        {
            setFormData((prev)=>({
                ...prev,
              [name]:value,
            }))
        }
    }
    
        const handleSubmit=(e)=>{
            e.preventDefault()
            const data=new FormData()
                data.append("fullname", formData.fullname)
                data.append("username", formData.username)
                data.append("email", formData.email)
                data.append("password", formData.password)
                data.append("avatar", formData.avatar)
            dispatch(register(data)).unwrap()
            .then(()=> {navigate("/login")})
            .catch((error)=>{console.log(error)})
        }

        return (
        <main>
            <h1>Sign Up </h1>
            {error && <p>{error}</p> }

            <form onSubmit={handleSubmit}>
                <input 
                type="text"
                name="username"
                placeholder="enter username"
                value={formData.username}
                onChange={handleChange}
                />
                <input 
                type="text"
                name="fullname"
                placeholder="enter fullname"
                value={formData.fullname}
                onChange={handleChange}
                />
                <input 
                type="email"
                name="email"
                placeholder="enter email"
                value={formData.email}
                onChange={handleChange}
                />
                <input 
                type="password"
                name="password"
                placeholder="enter password"
                value={formData.password}
                onChange={handleChange}
                />
                 <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                required
                />
                <button type="submit" disabled={loading}>
                    {loading? "Signing Up..." : "Signup"}
                </button>
                 </form>
        </main>
    )
}

export default Register
