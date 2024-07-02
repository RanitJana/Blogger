import express from "express";
const router = express.Router();

import { displayWriter } from "../controllers/public.controller.js";

router.get("/", displayWriter)

export default router;