import api from "./axios.js"

export const registerUser=(formData)=>{
    return api.post("/users/register",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
}


export const loginUser=(data)=>{
    return api.post("/users/login",data)
}


export const logoutUser=()=>{
    return api.post("/users/logout")
}


export const getCurrentUser=()=>{
    return api.get("/users/current-user")
}


export const refreshAccessToken=()=>{
    return api.post("/users/refresh-token")
}