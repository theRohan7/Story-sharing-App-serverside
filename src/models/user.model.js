import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true
        },
        stories: [
            {
                story:{
                    type: Schema.Types.ObjectId,
                    ref: "Story"

                }
            }
        ],
        savedStories: [
            {
                story:{
                    type: Schema.Types.ObjectId,
                    ref: "Story"

                }
            }
        ]
    },
    {
        timestamps: true
    }
)

// encrypt password before saving it to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// check the given password with encrypted password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)