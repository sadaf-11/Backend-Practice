import { Router } from "express";
import { getAllTweets,createTweet,updateTweet,deleteTweet,getUserTweets } from "../controllers/tweet.controller.js";
import { optionalJWT, verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/").get(optionalJWT, getAllTweets)
router.route("/").post(verifyJWT,createTweet)
router.route("/:tweetId").patch(verifyJWT,updateTweet)
router.route("/:tweetId").delete(verifyJWT,deleteTweet)
router.route("/users/:userId").get(optionalJWT, getUserTweets)


export default router