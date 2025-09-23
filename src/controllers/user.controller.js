import { asyncHandler } from "../utils/asyncHandler.js";

//use of this  ,is that it going to just register the user

const registerUser = asyncHandler(async(req, res)=>{

res.status(200).json({
    message: "ok"
    })

 const { fullName, email,username,password} = req.body;
 console.log("email:", email)


}
)




//if data comes from body


export {registerUser}