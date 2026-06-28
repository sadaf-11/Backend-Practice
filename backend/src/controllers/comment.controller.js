import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1)

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort: { createdAt: -1 }
        },
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
        { $unwind: "$owner" },
        {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [req.user?._id || null, "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        video: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
    ])

    const comments = await Comment.aggregatePaginate(commentsAggregate, {
        page: pageNumber,
        limit: limitNumber
    })

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))
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

    const createdComment = await Comment.findById(comment._id).populate(
        "owner",
        "fullname username avatar"
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdComment, "Comment created Successfully")
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

    await updatedComment.populate("owner", "fullname username avatar")

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
