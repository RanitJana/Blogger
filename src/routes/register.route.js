const express = require("express");
const router = express.Router();
const { userRegister } = require("../controllers/user.controller.js");

router
    .post('/', userRegister)
    .get('/', (req, res) => {
        res.render("register")
    })

module.exports = router;