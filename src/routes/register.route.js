import express from "express";
const router = express.Router();
import { userRegister } from "../controllers/user.controller.js";

router
    .post('/', userRegister)
    .get('/', (req, res) => {
        res.render("register")
    })

export default router;