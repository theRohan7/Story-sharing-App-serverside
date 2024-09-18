import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Story, StorySlide  } from "../models/story.model.js"


const createStory = asyncHandler ( async(req, res) => {
  
    const userId = req.user._id

    return res
    .json(
        new ApiResponse(200, {userId}, "tadaaaaaa!!")
    )
})






export {
    createStory,
}