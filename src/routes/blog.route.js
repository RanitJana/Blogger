import express from "express";
const router = express.Router();
import { displayBlog } from "../controllers/public.controller.js";
import { sendComments } from "../controllers/public.controller.js";

import like from "./like.route.js";
import comment from "./comment.route.js";


router
    .use("/like", like)
    .use("/comment", comment)
    .get("/", displayBlog)
    .post("/", sendComments)

export default router;