import mongoose, { isValidObjectId } from "mongoose"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.models.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content}=req.body || {}

    if(!content?.trim()){
        throw new ApiError(400,"tweet content is required")
    }
    const tweet=await Tweet.create({
        content:content.trim(),
        owner:req.user?._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet created Successfully")
    ) 
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId}=req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user Id")
    }


    const tweet=await Tweet.find({owner:userId})
    .sort({createdAt:-1})

    if(tweet.length===0){
        throw new ApiError(400,"No tweets found!")
    }

    

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet," User Tweets fetched Successfully")
    ) 
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {tweetId}=req.params
    const {content}=req.body || {}

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet Id")
    }

    if(!content?.trim()){
         throw new ApiError(400,"tweet content is required")
    }

         const updatedTweet=await Tweet.findByIdAndUpdate(
            {
                _id:tweetId,
                owner:req.user?._id

            },
            {
                $set:{
                    content:content.trim()
                }
            },
            {
                returnDocument:"after"
            }
         )

          if(!updatedTweet){
        throw new ApiError(404,"Tweet not found")
    }

     return res
    .status(200)
    .json(
        new ApiResponse(200,updatedTweet," Tweet Updated Successfully")
    ) 
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet Id")
    }

    const deleteTweet=await Tweet.findOneAndDelete(
        {
            _id:tweetId,
            owner:req.user?._id
        }
        
    )

    if(!deleteTweet){
        throw new ApiError(404,"Tweet not found to delete")
    }
 return res
    .status(200)
    .json(
        new ApiResponse(200,deleteTweet," Tweet deleted Successfully")
    ) 

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
