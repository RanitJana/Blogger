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

const validUniqueEmail = async function (req, res, next) {
    
    const { email } = req.body;

    try {

        const user = await userSchema.findOne({ email: email });

        if (!user) return next();

        req.flash("fail", `${user.email} is already registerd by another user`);
        return res.redirect("/user");

    }
    catch (err) {
        req.flash("fail", "An error occurred!!");
        return res.redirect("/user");
    }
}

module.exports = {
    validUser,
    validUniqueEmail
}