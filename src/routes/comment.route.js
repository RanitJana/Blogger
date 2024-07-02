import express from "express";
const router = express.Router();

import { commentContent } from "../controllers/user.controller.js";

router.post("/", commentContent);

export default router;