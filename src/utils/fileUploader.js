import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) return console.error("Could not find file path :( ")
   
           const reponse = await cloudinary.uploader.upload(filePath, {
               resource_type: 'auto'
           })
   
           console.log("File uploaded successfully on cloudinary: ", reponse.url);
   
           return reponse;
    } catch (error) {
        fs.unlinkSync(filePath)
        return null
        
    }
}

export { uploadOnCloudinary }