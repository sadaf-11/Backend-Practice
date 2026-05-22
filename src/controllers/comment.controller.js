import {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const {content} = req.body || {}
    const {videoId} = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required")
    }

    const videoExists = await Video.exists({_id: videoId})

    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content: content.trim(),
        owner: req.user?._id,
        video: videoId
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, comment, "Comment created Successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId, videoId} = req.params
    const {content} = req.body || {}

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment Id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required")
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user?._id,
            video: videoId
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
           returnDocument:"after"
        }
    )

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment Updated Successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId, videoId} = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment Id")
    }

    const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id,
        video: videoId
    })

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found to delete")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedComment, "Comment deleted Successfully")
    )
})
export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }