import express from "express";
const router = express.Router();

import { likeContent } from "../controllers/user.controller.js";

router
    .post("/", likeContent)

export default router;