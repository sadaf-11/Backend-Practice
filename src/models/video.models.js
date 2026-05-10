import mongoose,{Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
videoFile:{
    type:String,
    required:true, //cloudinary
},
thumbnail:{
    type:String,
    required:true, //cloudinary
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true, 
},
title:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
duration:{
    type:Number,
    required:true, //cloudinary
},
views:{
    type:Number,
    required:true,
    default:0 
},
isPublished:{
    type:Boolean,
    required:true,
    default:true
},

},{timestamps:true})

videoSchema.plugin(aggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)