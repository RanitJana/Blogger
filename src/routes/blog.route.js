const express = require("express");
const router = express.Router();
const { displayBlog } = require("../controllers/public.controller.js");

router.get('/', displayBlog)

module.exports = router;