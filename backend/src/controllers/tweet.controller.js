import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.models.js"
import { Like } from "../models/like.models.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body || {}

    if (!content?.trim()) {
        throw new ApiError(400, "tweet content is required")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id
    })

    // Populate owner before returning
    const populatedTweet = await Tweet.findById(tweet._id).populate(
        "owner",
        "username fullname avatar"
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, populatedTweet, "Tweet created Successfully")
        )
})

const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
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
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
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
      $and: [
        { $ne: [req.user?._id, null] },
        {
          $in: [
            req.user?._id
              ? new mongoose.Types.ObjectId(req.user._id)
              : null,
            "$likes.likedBy",
          ],
        },
      ],
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
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ])
  

  if (tweets.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No tweets found"))
}

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id")
    }

    const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
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
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
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
      $and: [
        { $ne: [req.user?._id, null] },
        {
          $in: [
            req.user?._id
              ? new mongoose.Types.ObjectId(req.user._id)
              : null,
            "$likes.likedBy",
          ],
        },
      ],
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
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ])

    if (tweets.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No tweets found"))
}

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweets, "User Tweets fetched Successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body || {}

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "tweet content is required")
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user?._id
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
            returnDocument: "after"
        }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found")
    }

    // Re-fetch with populated owner
    const populatedTweet = await Tweet.findById(updatedTweet._id).populate(
        "owner",
        "username fullname avatar"
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, populatedTweet, "Tweet Updated Successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const deleteTweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner: req.user?._id
        }
    )

    if (!deleteTweet) {
        throw new ApiError(404, "Tweet not found to delete")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteTweet, "Tweet deleted Successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}
