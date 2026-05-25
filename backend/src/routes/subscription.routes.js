import { Router } from "express";
import { getUserChannelSubscribers,getSubscribedChannels, toggleSubscription} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/subscribed-channels/:subscriberId").get(verifyJWT,getSubscribedChannels)
router.route("/subscribers/:channelId").get(getUserChannelSubscribers)
router.route("/:channelId").post(verifyJWT,toggleSubscription)


export default router