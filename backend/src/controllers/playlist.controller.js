import mongoose, {isValidObjectId, Mongoose} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getOrCreateWatchLaterPlaylist = async (userId) => {
    let playlist = await Playlist.findOne({ owner: userId, isWatchLater: true })

    if (!playlist) {
        playlist = await Playlist.create({
            name: "Watch Later",
            description: "Videos saved to watch later",
            owner: userId,
            isWatchLater: true,
        })
    }

    return playlist
}

const populatePlaylistVideos = (playlistId) =>
    Playlist.findById(playlistId)
        .populate("owner", "fullname username avatar")
        .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "fullname username avatar",
            },
        })

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body || {}
    if(!name?.trim()){
        throw new ApiError(400,"name is required")
    }
     if(!description?.trim()){
        throw new ApiError(400,"description is required")
    }
    if (name.trim().toLowerCase() === "watch later") {
        throw new ApiError(400, "Cannot create a playlist named Watch Later")
    }
    //TODO: create playlist
    if(!req.user?._id){
         throw new ApiError(401,"Unauthorized request")
     }
const existedName=await Playlist.findOne(
    {name:name.trim()}
)
if(existedName)
    {
        throw new ApiError(409,"Playlist name already Exists use different name")
    }
    

    const playlist=await Playlist.create({
        name:name.trim(),
        description:description.trim(),
        owner:req.user?._id
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist created Successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
            throw new ApiError(400,"Invalid User Id")
        }
        const playlists = await Playlist.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                    isWatchLater: { $ne: true },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    firstVideoId: { $arrayElemAt: ["$videos", 0] },
                    videoCount: { $size: "$videos" },
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "firstVideoId",
                    foreignField: "_id",
                    as: "firstVideo",
                },
            },
            {
                $addFields: {
                    firstVideoThumbnail: {
                        $arrayElemAt: ["$firstVideo.thumbnail", 0],
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    owner: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    videoCount: 1,
                    firstVideoThumbnail: 1,
                },
            },
        ])

        return res
            .status(200)
            .json(
                new ApiResponse(200, playlists, " User playlists fetched Successfully")
            )
})

const getWatchLater = asyncHandler(async (req, res) => {
    const watchLater = await getOrCreateWatchLaterPlaylist(req.user._id)
    const populated = await populatePlaylistVideos(watchLater._id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, populated, "Watch later fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"Invalid Playlist Id")
        }
        const playlist=await Playlist.findById(playlistId).populate(
    "owner",
    "fullname username avatar")
     .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "fullname username avatar"
            }
        })
     if(!playlist){
                throw new ApiError(400,"playlist not found!")
            }
        
            
        
            return res
            .status(200)
            .json(
                new ApiResponse(200,playlist," playlist fetched Successfully")
            )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"Invalid Playlist Id")
        }
    if(!isValidObjectId(videoId)){
            throw new ApiError(400,"Invalid Video Id")
        }

       
        const addedVideo=await Playlist.findOneAndUpdate(
           { _id:playlistId,
            owner:req.user?._id
           },
           {
            $addToSet:{
                videos:videoId
            }
           },
           {
            returnDocument:"after"
           }
        )
        
    if(!addedVideo){
        throw new ApiError(404, "Playlist not found")
    }
        return res
            .status(200)
            .json(
                new ApiResponse(200,addedVideo," Video added to playlist Successfully")
            )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"Invalid Playlist Id")
        }
    if(!isValidObjectId(videoId)){
            throw new ApiError(400,"Invalid Video Id")
        }

        const deletedVideo=await Playlist.findOneAndUpdate({
            _id:playlistId,
            videos:videoId,
            owner:req.user?._id
        },
    {
        $pull:
        {videos:videoId}
    },
    {
        returnDocument:"after"
    }
)
 if(!deletedVideo){
        throw new ApiError(404, "Playlist not found")
    }
    return res
            .status(200)
            .json(
                new ApiResponse(200,deletedVideo," Video deleted to playlist Successfully")
            )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"Invalid Playlist Id")
        }
        const deletedPlaylist=await Playlist.findOneAndDelete({
            _id:playlistId,
            owner:req.user?._id
        })
        if(!deletedPlaylist){
            throw new ApiError(404,"Playlist not found")
        }
        if (deletedPlaylist.isWatchLater) {
            throw new ApiError(400, "Cannot delete Watch Later playlist")
        }
    return res
            .status(200)
            .json(
                new ApiResponse(200,deletedPlaylist,"  playlist deleted Successfully")
            )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body ||{}
     if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"Invalid Playlist Id")
        }
     const updateFields={}
    if(name?.trim()){
        updateFields.name=name.trim()
    }
    if(description?.trim()){
        updateFields.description=description.trim()
    }
    if(Object.keys(updateFields).length===0){
        throw new ApiError(400,"atleast one field is required")
    }
    const updatedPlaylist=await Playlist.findOneAndUpdate(
                {_id:playlistId,
            owner:req.user?._id},
                {
                    $set:
                       updateFields
                    
                },
                {
                    returnDocument:"after"
                }
            )
            if(!updatedPlaylist){
                       throw new ApiError(400,"error updating playlist")
 
            }
        
            return res
            .status(200)
            .json(new ApiResponse(200,updatedPlaylist,"Playlist Updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getWatchLater,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
