import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Story } from "../models/story.model.js"
import { User } from "../models/user.model.js";


const createStory = asyncHandler ( async(req, res) => {
  
    const userId = req.user._id

    const {category, slides} = req.body  // slides will be an array of each  slide object

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
        likesCount: slide.likesCount
    })) 

    
    const story = await Story.create({
        owner: userId,
        storySlides: storySlides,
        Category: category
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

const editStory = asyncHandler ( async (req, res) => {
   
    const userId = req.user._id;
    const {storyId} = req.params;
    const { category, slides} = req.body;

    if(!slides || slides.length<3 || slides.length > 6 ){
        throw new ApiError(400, "A story must have slides between 3 and 6");
    }

    const story = await Story.findById(storyId);

    if(!story){
        throw new ApiError(404, "Story not found");
    }

    if(story.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You're not Authorized to edit this story.")
    }

    story.storySlides = slides.map(slide => ({
        heading: slide.heading,
        description: slide.description,
        mediaURL: slide.mediaURL,
        likesCount: slide.likesCount || 0
    }))

    story.updatedAt = Date.now()
    story.Category = category

    await story.save();

   return res
   .status(200)
   .json(
    new ApiResponse(200, {story}, "Story updated successfully.")
   )
    
})

const bookmarkStory = asyncHandler ( async (req, res) => {
    
    const userId = req.user._id;
    const {storyId} = req.params;

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const story = await Story.findById(storyId)

    if(!story){
        throw new ApiError(404, "Story not found to bookmark.")
    }

    // pushing story to bookmark and on clicking again on same button it should remove the give story.
    if(user.savedStories.some(savedStory => savedStory._id.equals(story._id))){
        const index = user.savedStories.findIndex(savedStory => savedStory._id.equals(story._id));
        user.savedStories.splice(index, 1)
    } else {
        user.savedStories.push({ _id: story._id }); // push a new object with the story ID
    }
      
    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, {user}, "Story Bookmarked!")
    )
})

const getAllStory = asyncHandler( async(req, res) => {
    
    const stories = await Story.find();

    if(!stories){
        throw new ApiError(500,"Error fetching stories")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, {stories}, "storiees fetched successfully."))
})

const getUserStories = asyncHandler( async (req, res) => {
    const userId = req.user._id 

    const  user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const userStories = user.stories

    return res
    .status(200)
    .json( new ApiResponse(200, {userStories},  "Fetched user stories") )
    
})

const filterStories = asyncHandler ( async (req, res) => {
    const { category } = req.query;

    if(!category){
        const allStories = await Story.find()
        return res.json(new ApiResponse(200, {allStories}, "Stories fetched successfully."))
    }

    const stories = await Story.find({Category: category})

    if(stories.length === 0){
        new ApiResponse(404, "No stories found for this category")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, stories, "Stories fetched successfully.") )
})





export {
    createStory,
    editStory,
    bookmarkStory,
    getAllStory,
    getUserStories,
    filterStories
}