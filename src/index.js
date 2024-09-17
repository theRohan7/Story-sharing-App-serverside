 import dotenv from "dotenv";
 import { app } from "./app.js";


 dotenv.config({
    path: './env'
 })

 app.listen(8000, () => {
    console.log("servver is running on port 8000");
 })

