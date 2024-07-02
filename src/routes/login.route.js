import express from "express";
const router = express.Router();
import { userLogin } from "../controllers/user.controller.js";

router
    .get('/', (req, res) => {
        res.render("login")
    })
    .post('/', userLogin);

export default router;