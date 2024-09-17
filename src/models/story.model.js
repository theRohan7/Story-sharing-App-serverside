import mongoose, { Schema } from "mongoose";

const storySlideSchema = new Schema(
    {
        heading:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        mediaURL:{
            type: String,
            required: true,
        },
        Category:{
            enum: "Food" | "Travel" | "Science" | "Nature" | "Technology" ,
            required: true,
        },
        likesCount:{
            type: number,
            default: 0,
        },
    
    },
    {
        timestamps:true
    }
)

const storySchema = new Schema (
    {
        storySlides: [ storySlideSchema ],
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export const Story = mongoose.model("Story", storySchema)
export const StorySlide = mongoose.model("StorySlide", storySlideSchema)