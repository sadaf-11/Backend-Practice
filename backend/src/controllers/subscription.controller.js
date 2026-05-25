import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId){
        throw new ApiError(400,"channel not found")
    }

    if(channelId===req.user?._id.toString()){
                throw new ApiError(400,"You cannot subscribe to yourself")
    }

    const channel=await User.findById(channelId).select("_id")
    if(!channel){
        throw new ApiError(404,"channel not found")
    }
    const subscription=await Subscription.findOneAndDelete({
        channel:channelId,
        subscriber:req.user?._id
    })

    if(subscription){
        return res
        .status(200)
        .json(
            new ApiResponse(200,{subscribed:false},"channel unsubscribed successfully")
        )
    }
    await Subscription.create({
         channel:channelId,
        subscriber:req.user?._id
    })
    return res
        .status(200)
        .json(
            new ApiResponse(200,{subscribed:true},"channel subscribed successfully")
        )
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400,"channel not found")
    }

    const subscribers=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)

            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                    {
                         $project: {
                            fullname: 1,
                            username: 1,
                             avatar: 1
                         }
                    }
                ]
            }
        },
        {
            $addFields:{
                subscriber:{
                    $first:"$subscriber"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$subscriber"
            }
        }
    ])

 return res
        .status(200)
        .json(
            new ApiResponse(200,subscribers,"channel subscribers fetched successfully")
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId){
        throw new ApiError(400,"subscriber not found")
    }

    const channels=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)

            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel",
                pipeline:[
                    {
                         $project: {
                            fullname: 1,
                            username: 1,
                             avatar: 1
                         }
                    }
                ]
            }
        },
        {
            $addFields:{
                channel:{
                    $first:"$channel"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$channel"
            }
        }
    ])

 return res
        .status(200)
        .json(
            new ApiResponse(200,channels,"subscribed channels  fetched successfully")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}