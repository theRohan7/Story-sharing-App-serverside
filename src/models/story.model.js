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
        likesCount:{
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            }
        ]
    
    },
    {
        timestamps:true
    }
)

const storySchema = new Schema (
    {
        storySlides: [ storySlideSchema ],
        Category:{
            type: String,
            enum: ["Food" , "Travel" , "Science" , "Nature" , "Technology"] ,
            default: "Food"
            
        },
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
