import { Schema, model } from "mongoose";

const blogSchema = new Schema(
    {
        blogImage: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        heading: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Blog', blogSchema)