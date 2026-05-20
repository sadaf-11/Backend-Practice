import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken=async(userId)=>
{
    try {
       const user= await User.findById(userId)
      const accessToken= user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

       user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})

       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating  refresh and access token")
    }
}


const registerUser=asyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation
    //check if already exist :username,email
    //check for images ,avatar
    //upload them to cloudinary,avatar
    //create user object-create entry in db
    //remove password and request token fieled fromresponse
    //check for user creation
    //return response

    const {fullname,email,password,username}=req.body || {}
    console.log("email:",email);


    if(
        [fullname,email,password,username].some((field)=>
            !field || 
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    if(!email.includes("@")){
        throw new ApiError(400,"Invalid Email")
    }

    const existedUser=await User.findOne({
        $or:[{email},{username}]
    })
    if(existedUser)
    {
        throw new ApiError(409,"User with email or username already Exists")
    }

    const avatarLocalPath=req.files?.avatar?.[0]?.path;

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    console.log(req.files)
console.log(req.body)

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
 const createdUser=await User.findById(user._id).select("-password -refreshToken")

 if(!createdUser){
    throw new ApiError(500,"error registering the user")
 }

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
) 

})

const loginUser=asyncHandler(async(req,res)=>{
// get user details from frontend 
//check validation
//check if details match
//check password
//generate access and refresh token
//send cookies
//retrun response


const {email,username,password}=req.body || {}
if(!(username || email)){
    throw new ApiError(400,"username or email is required")

}
const user =await User.findOne({
    $or:[{username},{email}]
})
 if(!user){
    throw new ApiError(404,"user doesnot exists")


 }

const isPasswordValid=await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(404,"Invalid User Credentials")
 }

const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

const loggedInUser=await User.findById(user._id).select(
    "-password -refreshToken")

const options={
    httpOnly:true,
    secure:true
}
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User Logged In Succesfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
        {
            returnDocument: "after"
        }
    

)
const options={
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User Logged Out Succesfully"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
 const incomingRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken
 if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
 }
 try {
    const decodedToken=jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user= await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
    }
     const options={
        httpOnly:true,
        secure:true,
     }
     const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken
            },
            "Access token refreshed"
        )
     )
    } catch (error) {
       throw new ApiError(401,error?.message || "Invalid refresh Token")
    }
    
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body

   const user=await User.findById(req.user?._id)
   const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
   if(!isPasswordCorrect){
    throw new ApiError(400,"enter correct password")
   }
  if (newPassword === confirmPassword) {
     user.password=newPassword
     await user.save({validateBeforeSave:false})
  } else {
    throw new ApiError(401,"Password does not match")
  }

   return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password Changed successfully")
    )
   
})

const getCurrentUser=asyncHandler(async (req,res)=> {
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"current user fetched successfully")
    )
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const{fullname,email,username}=req.body

    if(!fullname || !email){
         throw new ApiError(400,"All fields are required")
    }

    const updatedUser=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email,username
            }
        },{
            returnDocument:"after"
        }
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200,updatedUser,"Account details updated successfully")
    )
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

        if(!avatar.url){
             throw new ApiError(400,"error while uploading Avatar")
        }
        
    const updatedAvatar=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            returnDocument:{after}
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,avatar.url,"Avatar Updated Successfully"))
})
const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

        if(!coverImage.url){
             throw new ApiError(400,"error while uploading Cover Image")
        }
    const updatedcoverImage=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {
            returnDocument:{after}
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,coverImage.url,"Avatar Updated Successfully"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params
    if(!username?.trim){
        throw new ApiError(400,"username is missing")
    }

   const channel= await User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            subscribersCount:{
                $size:"$subscribers"
            },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
            isSubscribed:
            {$cond:{
                if:{
                    $in:[request.user?._id,"$subscribers.subscriber"]
                },
                then:true,
                else:false
            }
        }

        }
    },
    {
        $project:{
            fullname:1,
            username:1,
            subscribersCount,
            channelsSubscribedToCount,
            isSubscribed,
            avatar:1,
            coverImage:1,
            email:1
        }
    }
   ])
   console.log(channel)

   if(!channel?.length){
    throw new ApiError(400,"channel doesnot exists")
   }
   return res
   .status(200)
   .json(
    new ApiResponse(200,channel[0],"User Channel Fetched Successfully")
   )
})

const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                },{
                                   $addFields:{
                                    owner:{
                                        $first:"$owner"
                                    }
                                   } 
                                }
                            ]
                        }
                    },
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(200,watchHistory,"Watch history Fetched Successfully")
    )
})
export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}