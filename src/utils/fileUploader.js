import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log("came to uploadOnCloudinary to uplaod");
    console.log(localFilePath);
    
    
  try {
    if (!localFilePath) return console.error("Could not find file path :( ");

    const fileExtension = path.extname(localFilePath)


    const isVideo = fileExtension === '.mp4' || fileExtension === '.mov'
      console.log("is is a video ?", isVideo);
      

    if (isVideo) {
      const videoDetails = await cloudinary.api.resource(localFilePath, {
        resource_type: "video",
      });

      console.log("Video Details: ",videoDetails);

      if (videoDetails.duration > 15) {
        console.error("Video Durationn exceeds the 15-second limit.");
        throw new Error("Video Duration cannot exceed 15 seconds.");
      }

      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "video",
      });
      console.log("Video uploaded successfully on cloudinary: ", response.url);

      return response;
    } else {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log("File uploaded successfully on cloudinary: ", response.url);

      return response;
    }
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); // Remove the file if it exists
     } 
    console.error("Error while uploading to Cloudinary: ", error.message);
    return null;
  }
};

export { uploadOnCloudinary };
