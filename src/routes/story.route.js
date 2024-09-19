import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"
import { bookmarkStory, createStory, editStory, filterStories, getAllStory, getUserStories, incrementLikes } from "../controllers/story.controller.js";

const router = Router()

const uploadMultiple = upload.fields([
    { name: 'media0', maxCount: 1 },
    { name: 'media1', maxCount: 1 },
    { name: 'media2', maxCount: 1 },
    { name: 'media3', maxCount: 1 },
    { name: 'media4', maxCount: 1 },
    { name: 'media5', maxCount: 1 },
]);

//General routes

router.route("/").get(getAllStory)
router.route("/filter").get(filterStories)



// secured Routes
router.route("/create-story").post( verifyJWT, uploadMultiple ,createStory)
router.route("/edit-story/:storyId").post( verifyJWT, editStory)
router.route("/bookmark/:storyId").post( verifyJWT, bookmarkStory)
router.route("/user-stories").get( verifyJWT, getUserStories)
router.route("/increment-likes").post( verifyJWT, incrementLikes)



export default router