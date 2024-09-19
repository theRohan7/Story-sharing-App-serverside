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

            const isVideo = filePath.endsWith('.mp4') || filePath.endsWith('.mov') || filePath.includes('videos')

            if(isVideo){
                
                const videoDetails = await cloudinary.api.resource(filePath, { resource_type: 'video' });

                console.log(videoDetails);
                
                if(videoDetails.duration > 15){
                    console.error("Video Durationn exceeds the 15-second limit.")
                    throw new Error("Video Duration cannot exceed 15 seconds.")
                }

                const response = await cloudinary.uploader.upload(filePath, {resource_type: 'video'})
                console.log("Video uploaded successfully on cloudinary: ", response.url);
                
                return response;

            } else {

                const response = await cloudinary.uploader.upload(filePath, {
                    resource_type: 'auto'
                })
                console.log("File uploaded successfully on cloudinary: ", response.url);
        
                return response;

            }
             
    } catch (error) {
        // if (fs.existsSync(filePath)) {
        //     fs.unlinkSync(filePath); // Remove the file if it exists
        // } else {
        //     console.warn("File does not exist, nothing to delete.");
        // }

        // console.error("Error during Cloudinary upload: ", error);
        return null;
        
    }
}

export { uploadOnCloudinary }