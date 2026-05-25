import { Router } from "express";
import { createTweet,updateTweet,deleteTweet,getUserTweets } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/").post(verifyJWT,createTweet)
router.route("/:tweetId").patch(verifyJWT,updateTweet)
router.route("/:tweetId").delete(verifyJWT,deleteTweet)
router.route("/users/:userId").get(verifyJWT,getUserTweets)


export default router