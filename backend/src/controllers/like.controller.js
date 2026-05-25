import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
     if(!isValidObjectId(videoId))
     {
        throw new ApiError(400,"Invalid Video Id")
     }

    const like =await Like.findOneAndDelete({
    video:videoId,
    likedBy:req.user?._id
  }
)
if (like) {
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "Video unliked successfully"))
    }
 await Like.create({
    video:videoId,
    likedBy:req.user?._id
 })
 return res
        .status(200)
        .json(new ApiResponse(200, {liked: true}, "Video liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId))
        {
        throw new ApiError(400,"Invalid Tweet Id")
     }
     const like =await Like.findOneAndDelete({
    tweet:tweetId,
    likedBy:req.user?._id
  }
)
if (like) {
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "Tweet unliked successfully"))
    }
 await Like.create({
    tweet:tweetId,
    likedBy:req.user?._id
 })
 return res
        .status(200)
        .json(new ApiResponse(200, {liked: true}, "Tweet liked successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId?.trim()
    //TODO: toggle like on comment
     if(!isValidObjectId(commentId))
     {
        throw new ApiError(400,"Invalid Comment Id")
     }
  const like =await Like.findOneAndDelete({
    comment:commentId,
    likedBy:req.user?._id
  }
)
if (like) {
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "Comment unliked successfully"))
    }
 await Like.create({
    comment:commentId,
    likedBy:req.user?._id
 })
 return res
        .status(200)
        .json(new ApiResponse(200, {liked: true}, "Comment liked successfully"))
})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")
    }
    const likedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(userId),
                video:{$exists:true,$ne:null}
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
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
                            }
                        ]
                    }
                },
{
            $addFields:{
                owner:{$first:"$owner"}
                       }
               }
             ]
            }
        },
        {
    $addFields: {
        video: { $first: "$video" }
    }
},
         {
            $replaceRoot:{
                newRoot:"$video"
            }
        }
    ])
return res
    .status(200)
    .json(
        new ApiResponse(200,likedVideos,"Liked videos fetched successfully"))
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}

