const { Schema, model } = require("mongoose");

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

module.exports = model('Comment', commentSchema)