import { Router } from "express";
import { getAllVideos,publishAVideo,deleteVideo,getVideoById,updateVideo, updateVideoFile,togglePublishStatus } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"


const router=Router();

router.route("/publish-video").post(verifyJWT,upload.fields([
    {
        name:"vidoeFile",maxCount:1
    },
    {
        name:"thumbnail",maxCount:1
    }
]),publishAVideo)
router.route("/").get(getAllVideos)
router.route("/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/:videoId").delete(verifyJWT,deleteVideo)
router.route("/:videoId").get(verifyJWT,getVideoById)
router.route("/toggle/publish/:videoId").get(verifyJWT,togglePublishStatus)
router.route("/update/file/:videoId").patch(verifyJWT,upload.single("videoFile"),updateVideoFile)


export default router