import { Router } from "express";
import { getLikedVideos,toggleCommentLike,toggleVideoLike,toggleTweetLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/tweets/:tweetId").post(verifyJWT,toggleTweetLike)
router.route("/videos/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/comments/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/users/:userId/videos").get(verifyJWT,getLikedVideos)


export default router