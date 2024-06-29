const express = require("express");
const router = express.Router();
const { displayBlog } = require("../controllers/public.controller.js");

const like = require("./like.route.js");

router
    .get("/", displayBlog)
    .use("/like", like)

module.exports = router;