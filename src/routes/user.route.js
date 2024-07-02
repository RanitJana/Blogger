import express from "express";
const router = express.Router();
import upload from "../utils/multer.js";

import { validUser } from "../middlewares/auth.middleware.js";
import { updateProfile, displayProfile, userLogOut } from "../controllers/user.controller.js";

import edit from "./edit.route.js";
import erase from "./delete.route.js";
import writer from "./writer.route.js";

router
    .use("/edit", edit)
    .use("/delete", erase)
    .use("/writer", writer)
    .get('/', validUser, displayProfile)
    .post('/', validUser, (req, res) => {

        const action = req.body.action;

        switch (action) {
            case "update":
                return res.redirect("/update-user");
                break;
            case "logOut":
                return res.redirect("/log-out");
                break;
        }
        return res.redirect("/login");
    })
    .post("/update-user", upload.single("file"), updateProfile)
    .post("/log-out", validUser, userLogOut)

export default router;