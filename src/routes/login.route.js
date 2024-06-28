const express = require("express");
const router = express.Router();
const { userLogin } = require("../controllers/user.controller.js");

router
    .get('/', (req, res) => {
        res.render("login")
    })
    .post('/', userLogin);

module.exports = router;