const express = require("express");
const router = express.Router();
const upload = require("../utils/multer.js");

const { validUser, validUniqueEmail } = require("../middlewares/auth.middleware.js");
const { updateProfile, displayProfile, userLogOut } = require("../controllers/user.controller.js");

const edit = require("./edit.route.js");
const erase = require("./delete.route.js");
const writer = require("./writer.route.js");

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
    .post("/update-user", validUser, validUniqueEmail, upload.single("file"), updateProfile)
    .post("/log-out", validUser, userLogOut)

module.exports = router;