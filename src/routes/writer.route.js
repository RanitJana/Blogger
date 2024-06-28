const express = require("express");
const router = express.Router();

const { displayWriter } = require("../controllers/public.controller.js");

router.get("/", displayWriter)

module.exports = router;