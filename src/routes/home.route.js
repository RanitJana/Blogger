const express = require("express");
const router = express.Router();
const {displayHome} = require("../controllers/public.controller.js");

router.get('/', displayHome);

module.exports = router;