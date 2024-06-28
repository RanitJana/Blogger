const express = require("express");
const router = express.Router();

const { validUser } = require("../middlewares/auth.middleware.js");
const { deleteContent } = require("../controllers/user.controller.js");

router
    .get("/", validUser, deleteContent);

module.exports = router;