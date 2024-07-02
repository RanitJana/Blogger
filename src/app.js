import express from "express";
import path from "path";
const app = express();
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import jwt from "jsonwebtoken";
import cors from "cors";
import compression from "compression";

import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//basic configuration
app.use(compression());
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

    res.set('Cache-Control', 'public, max-age=86400')

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

import home from "./routes/home.route.js";
import register from "./routes/register.route.js";
import login from "./routes/login.route.js";
import post from "./routes/post.route.js";
import blog from "./routes/blog.route.js";
import user from "./routes/user.route.js";

app.use("/", home);
app.use("/register", register);
app.use("/login", login);
app.use("/post", post);
app.use("/blog", blog);
app.use("/user", user);


export default app;