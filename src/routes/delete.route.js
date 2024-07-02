import express from "express";
const router = express.Router();

import { validUser } from "../middlewares/auth.middleware.js";
import { deleteContent } from "../controllers/user.controller.js";

router
    .get("/", validUser, deleteContent);

export default router;