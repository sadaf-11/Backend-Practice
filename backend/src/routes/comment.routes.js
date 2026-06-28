import { Router } from "express";
import { getVideoComments,addComment,deleteComment,updateComment } from "../controllers/comment.controller.js";
import { optionalJWT, verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/:videoId").post(verifyJWT,addComment)
router.route("/:videoId/:commentId").patch(verifyJWT,updateComment)
router.route("/:videoId/:commentId").delete(verifyJWT,deleteComment)
router.route("/:videoId").get(optionalJWT, getVideoComments)


export default router