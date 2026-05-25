import { Router } from "express";
import {createPlaylist,deletePlaylist,addVideoToPlaylist,updatePlaylist,removeVideoFromPlaylist,getPlaylistById,getUserPlaylists } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/").post(verifyJWT,createPlaylist)
router.route("/user/:userId").get(verifyJWT,getUserPlaylists)
router.route("/:playlistId").get(verifyJWT,getPlaylistById)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId").patch(verifyJWT,updatePlaylist)
router.route("/:playlistId/videos/:videoId").post(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/videos/:videoId").delete(verifyJWT,removeVideoFromPlaylist)


export default router
