import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Story, StorySlide  } from "../models/story.model.js"
import { User } from "../models/user.model.js";


const createStory = asyncHandler ( async(req, res) => {
  
    const userId = req.user._id

    const {slides} = req.body  // slides will be an array of each  slide object

    if(!slides || slides.length < 3 || slides.length > 6) {
        throw new ApiError(400, "A story must have slides between 3 and 6")
    }

    const user =await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User Not found");
    }

    const storySlides = slides.map(slide => ({
        heading: slide.heading,
        description: slide.description,
        mediaURL: slide.mediaURL,
        category: slide.category,
        likesCount: slide.likesCount
    })) 

    
    const story = await Story.create({
        owner: userId,
        storySlides: storySlides,
    })

    const storyCreated = await Story.findById(story._id)

    if(!storyCreated){
        throw new ApiError(500, "Something went wrong while creating story")
    }

    user.stories.push(storyCreated._id)
    await user.save();

    return res
    .status(201)
    .json( new ApiResponse(200, storyCreated, "Story created successfully"))

})






export {
    createStory,
}