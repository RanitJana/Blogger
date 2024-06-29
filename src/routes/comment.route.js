const express = require("express");
const router = express.Router();

const { commentContent } = require("../controllers/user.controller");

router.post("/", commentContent);

module.exports = router;