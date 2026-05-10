import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";

dotenv.config({
    path:'./env'
});

const app=express();



connectDB()
.then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on port ${process.env.PORT} || 8000`);
})
})
.catch((error)=>{
    console.error("Error Connecting to MongoDB:",error);
})






/*
const app=express();
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error",(err)=>{
            console.log("ERR:",err);
            throw err;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Error Connecting to MongoDB:",error);
        throw error;
    }
})()*/