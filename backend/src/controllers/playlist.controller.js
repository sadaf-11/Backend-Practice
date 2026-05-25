import mongoose, {isValidObjectId, Mongoose} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body || {}
    if(!name?.trim()){
        throw new ApiError(400,"name is required")
    }
     if(!description?.trim()){
        throw new ApiError(400,"description is required")
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
        const playlist=await Playlist.find({
            owner:userId
        }).sort({createdAt:-1}).lean()
         if(!playlist.length){
                    throw new ApiResponse(200,"playlists not found!")
                }

        return res
            .status(200)
            .json(
                new ApiResponse(200,playlist," User playlists fetched Successfully")
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
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
