import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//router import
import userRoutes from "./routes/user.routes.js"
import healthcheckRoute from "./routes/healthcheck.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"
import likeRoutes from "./routes/like.routes.js"
import videoRoutes from "./routes/video.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"

//router decleration
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/healthcheck',healthcheckRoute)
app.use('/api/v1/tweets',tweetRoutes)
app.use('/api/v1/likes',likeRoutes)
app.use('/api/v1/videos',videoRoutes)
app.use('/api/v1/comments',commentRoutes)
app.use('/api/v1/subscription',subscriptionRoutes)
app.use('/api/v1/dashboard',dashboardRoutes)
app.use('/api/v1/playlist',playlistRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    })
})
app.get("/api/v1/debug-tweets", (req, res) => {
  res.json({ message: "app is running updated code" })
})

export default app;
