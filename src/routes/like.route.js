const express = require("express");
const router = express.Router();

const { likeContent } = require("../controllers/user.controller.js");

router
    .get("/", likeContent)

module.exports = router;