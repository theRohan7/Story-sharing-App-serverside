import { v2 as cloudinary } from "cloudinary";
import axios from "axios";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const getVideoDuration = async(url) => {
  try {
    const response = await axios.head(url);
    console.log(response);
    
    const contentLength = response.headers['content-length'];
    const contentType = response.headers['content-type'];

    // if (!contentType.startsWith('video/')) {
    //   throw new Error('The provided URL is not a video.');
    // }

    // Use Cloudinary's remote media info API
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      upload_preset: 'ml_default', // Adjust this to your needs
      format: 'mp4',
      media_metadata: true,
      eager: [{ format: 'mp4', audio_codec: 'none', video_codec: 'h264' }],
      eager_async: true
    });

    return result.duration;
  } catch (error) {
    console.error('Error fetching video duration:', error);
    throw error;
  }
}

const uploadOnCloudinary = async (fileUrl) => {

  try {
    if(!fileUrl) throw new Error ("No file Url Provided")
      console.log(fileUrl);

    const isVideo = fileUrl.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
    const resourceType = isVideo ? "video" : "image"
      console.log("fileType: ", resourceType);
  
    if (isVideo) {
      const duration = await getVideoDuration(fileUrl)

      if(duration > 15){
        throw new Error("Video duration exceeds the 15-second limit.");
      }

      const response = await cloudinary.uploader.upload(fileUrl, {
        resource_type: "video"
      })

      console.log("Video uploaded successfully to Cloudinary:", response.url);
      return response;

    } else {
      const response = await cloudinary.uploader.upload(fileUrl, {
        resource_type: "image",
      });
      console.log("File uploaded successfully on cloudinary: ", response.url);

      return response;
    }
  } catch (error) {
    console.error("Error while uploading to Cloudinary: ", error.message);
    return null;
  }
};

export { uploadOnCloudinary };
