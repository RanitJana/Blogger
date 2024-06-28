const { Schema, model } = require("mongoose");

const commentSchema = new Schema();

module.exports = model('Comment', commentSchema)