import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({ limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


//router import
import userRoutes from "./routes/user.routes.js"
import healthcheckRoute from "./routes/healthcheck.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"
import likeRoutes from "./routes/like.routes.js"

//router decleration
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/tweets',tweetRoutes)
app.use('/api/v1/likes',likeRoutes)
app.use('/api/v1/healthcheck',healthcheckRoute)


export default app;