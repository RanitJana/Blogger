const userSchema = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const validUser = async function (req, res, next) {
    try {

        let token = req.cookies?.accessToken || req.header["Authorization"]?.replace("Bearer ", "");

        if (!token) {
            req.flash("fail", "Log in fisrt");
            return res.redirect("/login");

        }
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let user = await userSchema.findOne({ _id: decoded._id });

        if (!user) {
            req.flash("fail", "Invalid User");
            return res.redirect("/login");
        }

    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }

    return next();
}


module.exports = {
    validUser
}