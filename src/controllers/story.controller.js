import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Story } from "../models/story.model.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUploader.js";


const createStory = asyncHandler ( async(req, res) => {
  
    const userId = req.user._id
    const {category, slides} = req.body  // slides will be an array of each  slide object 
    
    if(!slides || slides.length < 3 || slides.length > 6) {
        throw new ApiError(400, "A story must have slides between 3 and 6")
    }

    if(!category || category.trim() === "") {
        throw new ApiError(400, "Category is required")
    }

    slides.forEach((slide, idx) =>{
        if(!slide.heading || slide.heading.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Heading is required.`)
        }
        if(!slide.description || slide.description.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Description is required.`)
        }
        if(!slide.mediaURL || slide.mediaURL.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Media URL is required.`)
        }
    } )

    const user =await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const storySlides = await Promise.all(
        slides.map( async (slide) => {
            let  fileurl = slide.mediaURL;
            
            try {
               const uploadedMedia = await uploadOnCloudinary(fileurl)
               var uploadedMediaURL = uploadedMedia.url
                
            } catch (error) {
              console.error('Error uploading to Cloudinary:', error); 
              throw new ApiError(500, error.message ||  "Failed to upload image to Cloudinary");
            }

            return {
                heading: slide.heading,
                description: slide.description,
                mediaURL: uploadedMediaURL,
                likesCount: slide.likesCount || 0
            }
        } )
    )
 
    const story = await Story.create({
        owner: userId,
        storySlides: storySlides,
        Category: category
    })

    const storyCreated = await Story.findById(story._id)

    if(!storyCreated){
        throw new ApiError(500, "Something went wrong while creating the story, Try Again.");
    }
    user.stories.push(storyCreated)
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

    if(!category || category.trim() === "") {
        throw new ApiError(400, "Category is required")
    }

    slides.forEach((slide, idx) =>{
        if(!slide.heading || slide.heading.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Heading is required.`)
        }
        if(!slide.description || slide.description.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Description is required.`)
        }
        if(!slide.mediaURL || slide.mediaURL.trim() === "") {
            throw new ApiError(400, `Slide ${idx + 1}: Media URL is required.`)
        }
    } )

    if(story.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You're not Authorized to edit this story.")
    }

    story.storySlides = await Promise.all(
        slides.map(async (slide) => {
            let uploadedMediaURL = slide.mediaURL

            if(slide.mediaURL){
                const uploadedMedia = await uploadOnCloudinary(slide.mediaURL);
                uploadedMediaURL = uploadedMedia.url
            }

            return {
                heading: slide.heading,
                description: slide.description,
                mediaURL: uploadedMediaURL,
                likesCount: slide.likesCount || 0
            }
        })
    )

    story.updatedAt = Date.now()
    story.Category = category

    await story.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(
    new ApiResponse(200, story, "Story updated successfully.")
   )
    
})

const bookmarkStory = asyncHandler ( async (req, res) => {
    
    const userId = req.user._id;
    console.log("userId:",userId);
    
    const {storyId} = req.params;
    console.log("storyId: ",storyId);
    

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
        user.savedStories.push(story._id); 
    }
      
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Story Bookmarked!")
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
     const userID = req.user._id;

     const user = await User.findById(userID);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const userStories = await Story.find({ _id: { $in: user.stories } })

    if(!userStories){
        throw new ApiError(404, "No stories found for this user")
    }

     return res
     .status(200)
     .json( new ApiResponse(200, userStories, "Fetched user stories") )

     
})

const filterStories = asyncHandler ( async (req, res) => {
    const { categories } = req.query;

    let stories;

    if(!categories || categories.length === 0 || categories.includes("All")){
        stories = await Story.find({})
    } else {
        const categoriesArray = Array.isArray(categories) ? categories : [categories];
        stories = await Story.find({Category: { $in: categoriesArray}})
    }

    if(stories.length === 0){
        new ApiResponse(404, [] ,"No stories found for this category")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, stories, "Stories fetched successfully.") )
})

const incrementLikes = asyncHandler (async (req, res) => {
    
   const userId = req.user._id;
   const  { storyId, slideId } = req.body;

   const story = await Story.findOne(
    {
        _id: storyId,
        "storySlides._id": slideId
    }
   );

   if(!story){
    throw new ApiError(404, "Story or slide not found")
   }
    
   const slideIndex = story.storySlides.findIndex(slide => slide._id.toString() === slideId)
   const slide = story.storySlides[slideIndex];

   const likedByUser = slide.likedBy.includes(userId);

   if(likedByUser){

    slide.likesCount -= 1
    slide.likedBy.pull(userId)

   } else {

    slide.likesCount += 1;
    slide.likedBy.push(userId);

   }

   await story.save({validateBeforeSave: false})

   return res
   .status(200)
   .json( new ApiResponse(200, {likesCount: slide.likesCount}, likedByUser ? "Like removed Succesfully" : "Like added succesfully"))

})

const getStoryById = asyncHandler( async (req, res) => {

    const {storyId} = req.params;
    const story = await Story.findById(storyId)

    if(!story){
        throw new ApiError(404, "Story not found")
    }
    
    return res
    .status(200)
    .json( new ApiResponse(200, story, "Story fetched successfully."))
})

const getBookmarkedStories = asyncHandler( async (req, res) => {
    const userID = req.user._id;

     const user = await User.findById(userID);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bookmarkedStories = await Story.find({ _id: { $in: user.savedStories } })

    if(!bookmarkedStories){
        throw new ApiError(404, "No stories found for this user")
    }

     return res
     .status(200)
     .json( new ApiResponse(200, bookmarkedStories, "Fetched Bookmarked stories") )

   
})





export {
    createStory,
    editStory,
    bookmarkStory,
    getAllStory,
    getUserStories,
    filterStories,
    incrementLikes,
    getStoryById,
    getBookmarkedStories,
}