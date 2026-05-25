import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const {channelId}=req.params
    if(!channelId || !mongoose.isValidObjectId(channelId)){
        throw new ApiError(400,"channel not found")
    }

    const channelObjectId=new mongoose.Types.ObjectId(channelId)

    const [videoStats,totalSubscribers]=await Promise.all([
        Video.aggregate([
            {
                $match:{
                    owner:channelObjectId
                }
            },
            {
                $lookup:{
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"likes"
                }
            },
            {
                $group:{
                    _id:null,
                    totalVideos:{
                        $sum:1
                    },
                    totalViews:{
                        $sum:"$views"
                    },
                    totalLikes:{
                        $sum:{
                            $size:"$likes"
                        }
                    }
                }
            },{
                $project:{
                    _id:0,
                    totalVideos:1,
                    totalViews:1,
                    totalLikes:1
                }
            }
        ]),

        Subscription.countDocuments({channel:channelObjectId})
    ])
    const channelStats={
         totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalLikes: videoStats[0]?.totalLikes || 0,
        totalSubscribers
    }
    return res
        .status(200)
        .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"))
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId || !mongoose.isValidObjectId(channelId)){
        throw new ApiError(400,"channel not found")
    }
    const channelVideos=await Video.find({owner:channelId})
        .select("videoFile title thumbnail duration views owner")
        .lean()
    if(!channelVideos.length){
        throw new ApiError(400,"videos not found in this channel")
        .lean()

    }
     return res
            .status(200)
            .json(new ApiResponse(200,channelVideos,"Video fetched Successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
