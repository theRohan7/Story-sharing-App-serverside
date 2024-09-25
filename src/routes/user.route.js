import { Router } from "express";
import { getUserDetails, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";




const router = Router()

// general routes

router.route("/register").post( registerUser);
router.route("/login").post( loginUser);


//secured Routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/user-details").get(verifyJWT, getUserDetails);





export default router;