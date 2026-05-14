// using promise
const asyncHandler=(asyncHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(asyncHandler(req,res,next))
        .catch((err)=>next(err))
    }

}

export default asyncHandler;


//using try catch

// const asyncHandler=(func)=>async(req,res,next)=>{
//     try {
//         await func(req,res,next)
//     } catch (err) {
//         res.status(err.code ||500).json({
//             success:false,
//             message:err.message
//         })
//     }
// } 