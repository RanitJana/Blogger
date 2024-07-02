import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        },
        content: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default model('Comment', commentSchema);