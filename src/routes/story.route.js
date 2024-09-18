import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createStory } from "../controllers/story.controller.js";

const router = Router()

router.route("/create-story").post( verifyJWT, createStory)



export default router