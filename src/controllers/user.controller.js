import { asyncHandler } from  "../utils/asyncHandler.js";
import  { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";




const registerUser = asyncHandler( async (req, res) => {

    const { username, password } = req.body

    if(username === ""){
      throw new ApiError(400, "Username is required")
    }
    if(password === ""){
      throw new ApiError(400, "Username is required")
    }

    const existedUser = await User.findOne({username})

    if(existedUser){
        throw new ApiError(409, "User with this username already exsists.")
    }

    const user = await User.create({
        username: username.toLowerCase() ,
        password,
        stories: [],
        savedStories: []
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering.")
    }

    return res
    .status(201)
    .json( new ApiResponse(200, createdUser, "user registered successfully.") )

})

const loginUser = asyncHandler( async (req, res) => {
    
    const { username, password } = req.body

    if(!username && !password){
        throw new ApiError(400, "Username or password is required.")
    }

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(404, "User does not exist.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(500, "Invalid user credentials")
    }

    const token = await user.generateToken()
    await user.save({validateBeforeSave:  false})


    const loggedinUser = await User.findById(user._id).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser, token
            },
            "user logged In Successfully"
        )
    )
})


const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $set:{
            token : undefined
           } 
        }, 
        {
            new: true
        }
    )

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "User logged out."))
})



export {
    registerUser,
    loginUser,
    logoutUser,

}