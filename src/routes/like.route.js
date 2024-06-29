const express = require("express");
const router = express.Router();

const { likeContent } = require("../controllers/user.controller.js");

router
    .post("/", likeContent)

module.exports = router;