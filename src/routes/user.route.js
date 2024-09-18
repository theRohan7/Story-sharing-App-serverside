import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";




const router = Router()

// general routes

router.route("/register").post( registerUser);
router.route("/login").post( loginUser);


//secured Routes

router.route("/logout").post(verifyJWT, logoutUser);





export default router;