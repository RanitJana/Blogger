import express from "express";
const router = express.Router();

import { validUser } from "../middlewares/auth.middleware.js";
import { editContent } from "../controllers/user.controller.js";
import blogSchema from "../models/blog.model.js";
import url from "url";

router
    .get("/", validUser, async (req, res) => {
        let myUrl = url.parse(req.url);

        let blogId = myUrl.query.replace("query=", "");

        let blog = await blogSchema.findById(blogId);

        res.locals.blog = blog;

        res.render("edit");
    })
    .post("/", validUser, editContent)

export default router;