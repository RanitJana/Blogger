const express = require("express");
const router = express.Router();
const { postBlog } = require("../controllers/user.controller.js");
const upload = require("../utils/multer.js");
const { validUser } = require("../middlewares/auth.middleware.js");

router
    .get('/', validUser, (req, res) => {
        res.render("post")
    })
    .post('/', validUser, upload.single("file"), postBlog)

module.exports = router;