// using promise
const aysncHandler=(asyncHnadler)=>{
    return (req,res,next)=>{
        Promise.resolve(asyncHnadler(req,res,next))
        .catch((err)=>next(err))
    }

}

export default aysncHandler;


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