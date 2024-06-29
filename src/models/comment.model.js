const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {

    },
    {
        timestamps: true
    }
);

module.exports = model('Comment', commentSchema)