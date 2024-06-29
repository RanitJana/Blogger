const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
    {
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        },
        likers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = model("Like", likeSchema);