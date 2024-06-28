const express = require("express");
const router = express.Router();

const { validUser } = require("../middlewares/auth.middleware.js");
const { editContent } = require("../controllers/user.controller.js");
const blogSchema = require("../models/blog.model.js");
const url = require("url");

router
    .get("/", validUser, async (req, res) => {
        let myUrl = url.parse(req.url);

        let blogId = myUrl.query.replace("query=", "");

        let blog = await blogSchema.findById(blogId);

        res.locals.blog = blog;
        
        res.render("edit");
    })
    .post("/", validUser, editContent)

module.exports = router;