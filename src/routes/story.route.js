import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { bookmarkStory, createStory, editStory, filterStories, getAllStory, getUserStories } from "../controllers/story.controller.js";

const router = Router()

//General routes

router.route("/").get(getAllStory)
router.route("/filter").get(filterStories)



// secured Routes
router.route("/create-story").post( verifyJWT, createStory)
router.route("/edit-story/:storyId").post( verifyJWT, editStory)
router.route("/bookmark/:storyId").post( verifyJWT, bookmarkStory)
router.route("/user-stories").get( verifyJWT, getUserStories)



export default router