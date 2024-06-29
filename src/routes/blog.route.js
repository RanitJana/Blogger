const express = require("express");
const router = express.Router();
const { displayBlog } = require("../controllers/public.controller.js");
const { sendComments } = require("../controllers/public.controller.js");

const like = require("./like.route.js");
const comment = require("./comment.route.js");


router
    .use("/like", like)
    .use("/comment", comment)
    .get("/", displayBlog)
    .post("/", sendComments)

module.exports = router;