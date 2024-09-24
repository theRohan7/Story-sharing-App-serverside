import { v2 as cloudinary } from "cloudinary";
import axios from "axios";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const getVideoDuration = async(url) => {
  console.log("getting video Duration for file:", url);
  try {
    
    const response = await axios.head(url);
    
    const contentLength = response.headers['content-length'];
    const contentType = response.headers['content-type'];


    // Use Cloudinary's remote media info API
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      upload_preset: 'ml_default', // Adjust this to your needs
      format: 'mp4',
      media_metadata: true,
      eager: [{ format: 'mp4', audio_codec: 'none', video_codec: 'h264' }],
      eager_async: true
    });

    console.log(result.duration);
    

    return result.duration;
  } catch (error) {
    console.error('Error fetching video duration:', error);
    throw error;
  }
}

const uploadOnCloudinary = async (fileUrl) => {
  if (!fileUrl) throw new Error("No file Url Provided");

  const isVideo = fileUrl.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
  const resourceType = isVideo ? "video" : "image";

  if (isVideo) {
    try {
    
      const duration = await getVideoDuration(fileUrl);

      if (duration > 15) {
        throw new Error("Video duration exceeds the 15-second limit.");
      }

      const response = await cloudinary.uploader.upload(fileUrl, {
        resource_type: "video",
      });

      console.log("Video uploaded successfully to Cloudinary:", response.url);
      return response;
    } catch (error) {
      console.error(
        "Error while uploading Video to Cloudinary: ",
        error.message
      );
    }
  } else {
    try {
      const response = await cloudinary.uploader.upload(fileUrl, {
        resource_type: "image",
      });
      console.log("File uploaded successfully on cloudinary: ", response.url);

      return response;
    } catch (error) {
      console.error(
        "Error while uploading image to Cloudinary: ",
        error.message
      );
    }
  }
};

export { uploadOnCloudinary };
