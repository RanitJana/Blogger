import express from "express";
const router = express.Router();
import { postBlog } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";
import { validUser } from "../middlewares/auth.middleware.js";

router
    .get('/', validUser, (req, res) => {
        res.render("post")
    })
    .post('/', validUser, upload.single("file"), postBlog)

export default router;