import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({ extended:true, limit: "16kb"}))
app.use(express.static("public"));


// Routing import

import userRouter from "./routes/user.route.js"
import storyRouter from "./routes/story.route.js"


// Route Declaration

app.use("/api/v1/user", userRouter)
app.use("/api/v1/story", storyRouter)




export { app };