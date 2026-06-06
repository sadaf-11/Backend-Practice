import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1)
    const match = { isPublished: true }

    if (query?.trim()) {
        const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const searchRegex = new RegExp(escapedQuery, "i")
        match.$or = [{ title: searchRegex }, { description: searchRegex }]
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid User Id")
        }
        match.owner = new mongoose.Types.ObjectId(userId)
    }

    const allowedSortFields = new Set(["createdAt", "updatedAt", "views", "duration", "title"])
    const sortField = allowedSortFields.has(sortBy) ? sortBy : "createdAt"
    const sortOrder = sortType === "asc" ? 1 : -1

    const videosAggregate = Video.aggregate([
        { $match: match },
        { $sort: { [sortField]: sortOrder } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
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
        { $unwind: "$owner" }
    ])

    const videos = await Video.aggregatePaginate(videosAggregate, {
        page: pageNumber,
        limit: limitNumber
    })

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body || {}
    // TODO: get video, upload to cloudinary, create video
        if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "All fields required")
}
        const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path
        const videoLocalPath=req.files?.videoFile?.[0]?.path
        if(!thumbnailLocalPath){
                throw new ApiError(400,"thumbnail file is required")
            }
        if(!videoLocalPath){
                throw new ApiError(400,"video file is required")
            }

            const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
            const video=await uploadOnCloudinary(videoLocalPath)
             if(!video){
                    throw new ApiError(400,"video file is required")
                }
             if(!thumbnail){
                    throw new ApiError(400,"thumbnail file is required")
                }

                const publishVideo=await Video.create({
                    owner:req.user?._id,
                    title:title.trim(),
                    description:description.trim(),
                    videoFile:video.url,
                    thumbnail:thumbnail.url,
                    duration:video.duration
                })
            if(!publishVideo){
    throw new ApiError(500,"error publishing the video")
 }
 return res.status(200).json(
     new ApiResponse(200,publishVideo,"video published Successfully")
 ) 
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }
    //TODO: get video by id
   const video = await Video.findById(videoId).populate(
    "owner",
    "fullname username avatar"
   )
    
        if(!video){
            throw new ApiError(400,"video not found!")
        }
    
        if (req.user?._id) {
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    $addToSet: {
                        watchHistory: video._id,
                    },
                }
            )
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,video," videos fetched Successfully")
        ) 
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const { title, description } = req.body || {}
    const updateFields = {}

    if (title?.trim()) {
        updateFields.title = title.trim()
    }

    if (description?.trim()) {
        updateFields.description = description.trim()
    }

    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path)

        if (!thumbnail?.url) {
            throw new ApiError(400, "error while uploading thumbnail")
        }

        updateFields.thumbnail = thumbnail.url
    }

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "At least one field is required")
    }

    const updatedVideo = await Video.findOneAndUpdate(
        {
            _id: videoId,
            owner: req.user?._id
        },
        {
            $set: updateFields
        },
        {
            returnDocument: "after"
        }
    )

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found or you are not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video Updated Successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
     if(!isValidObjectId(videoId)){
            throw new ApiError(400,"Invalid Video Id")
        }
    
        const deletedVideo=await Video.findOneAndDelete(
            {
                _id:videoId,
                owner:req.user?._id
            }
            
        )
    
        if(!deletedVideo){
            throw new ApiError(404,"Video not found to delete")
        }
     return res
        .status(200)
        .json(
            new ApiResponse(200,deletedVideo," Video deleted Successfully")
        ) 
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
            throw new ApiError(400,"Invalid Video Id")
        }

        const video=await Video.findOne(
            {
                _id:videoId,
                owner:req.user?._id
            }
        )
        if(!video){
            throw new ApiError(400,"video not found")
        }
        video.isPublished=!video.isPublished

        await video.save({validateBeforeSave:false})

        return res
        .status(200)
        .json(
            new ApiResponse(200,video.isPublished," Publish Status Updated Successfully")
        ) 

})

const updateVideoFile=asyncHandler(async(req,res)=>{
     const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }
    const videoLocalPath=req.file?.path
        if(!videoLocalPath){
            throw new ApiError(400,"Video file is missing")
        }
    
        const video=await uploadOnCloudinary(videoLocalPath)
    
            if(!video.url){
                 throw new ApiError(400,"error while uploading video")
            }
            
        const updatedVideo=await Video.findOneAndUpdate(
            {_id:videoId,
                owner: req.user?._id
            },
            {
                $set:{
                    videoFile:video.url,
                    duration:video.duration
                }
            },
            {
                returnDocument:"after"
            }
        )
        if (!updatedVideo) {
        throw new ApiError(404, "Video not found or you are not authorized")
    }
    
        return res
        .status(200)
        .json(new ApiResponse(200,video.url,"Video Updated Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateVideoFile
}

