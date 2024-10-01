import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  'https://story-sharing-sigma.vercel.app',
  'http://localhost:5173'
]

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if( allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({ extended:true, limit: "16kb"}))
app.use(express.static("public"));


// Routing import

import userRouter from "./routes/user.route.js"
import storyRouter from "./routes/story.route.js"
import { registerUser } from "./controllers/user.controller.js";


// Route Declaration

app.use("/api/v1/user", userRouter)
app.use("/api/v1/story", storyRouter)




export { app };