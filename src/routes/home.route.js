import express from "express";
const router = express.Router();
import {displayHome} from "../controllers/public.controller.js";

router.get('/', displayHome);

export default router;