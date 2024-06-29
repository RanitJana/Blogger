const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const cors = require("cors");

//basic configuration
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(flash());
app.use(cors());
app.use(express.json({ limit: "20kb" }))

// A middleware to use fail and success msg to display

app.use(async (req, res, next) => {

    res.locals.success = req.flash("success", "");
    res.locals.fail = req.flash("fail", "");

    let avater;
    try {
        avater = await jwt.verify(req.cookies?.accessToken, process.env.ACCESS_TOKEN_SECRET).avater;
    }
    catch (error) {
        avater = "/images/icons8-user-64.png";
    }
    res.locals.avater = avater;
    return next();
})

//routes

const home = require("./routes/home.route.js");
const register = require("./routes/register.route.js");
const login = require("./routes/login.route.js");
const post = require("./routes/post.route.js");
const blog = require("./routes/blog.route.js");
const user = require("./routes/user.route.js");

app.use("/", home);
app.use("/register", register);
app.use("/login", login);
app.use("/post", post);
app.use("/blog", blog);
app.use("/user", user);


module.exports = app;