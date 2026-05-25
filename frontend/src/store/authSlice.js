import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {registerUser,loginUser,getCurrentUser,logoutUser} from "../api/authApi.js"

const initialState={
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null,
}

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await loginUser(data)
    return response.data.data.user
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed"
    )
  }
})
export const register = createAsyncThunk("auth/register", async (formdata, thunkAPI) => {
  try {
    const response = await registerUser(formdata)
    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Registration failed"
    )
  }
})
export const fetchCurrentUser = createAsyncThunk("auth/currentUser", async (_, thunkAPI) => {
  try {
    const response = await getCurrentUser()
    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Not Authenticated"
    )
  }
})
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutUser()
    return null
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "logout failed"
    )
  }
})


const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        clearError:(state)=>{
            state.error=null
        },
    },

    extraReducers:(builder)=>{
        builder  //login
        .addCase(login.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading=false
            state.user=action.payload,
            state.isAuthenticated=true
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })

        //register
        .addCase(register.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.loading = false
        })
        .addCase(register.rejected,(state,action)=>{
            state.loading = false,
            state.error=action.payload
        })
        //fetchCurrentUser
        .addCase(fetchCurrentUser.fulfilled,(state,action)=>{
            state.user = action.payload,
            state.isAuthenticated = true
        })
        .addCase(fetchCurrentUser.rejected,(state)=>{
            state.user =null,
            state.isAuthenticated = false
        })
        //logout
        .addCase(logout.fulfilled,(state)=>{
            state.user = null,
            state.isAuthenticated = false
        })
    }
})

export const {clearError}=authSlice.actions
export default authSlice.reducer