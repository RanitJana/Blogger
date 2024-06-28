const userSchema = require("../models/user.model.js");
const blogSchema = require("../models/blog.model.js");
const url = require("url");
const { uploadAvater, uploadCoverImage, deleteImage } = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

async function generateAccessTokenAndRefreshToken(user) {
    let accessToken = await user.generateAccessToken();
    let refreshToken = await user.generateRefreshToken();

    return {
        accessToken,
        refreshToken
    }
}

function extractPublicId(url) {
    const firstUrl = url.split('/');
    const secondUrl = firstUrl[firstUrl.length - 1].split('.');

    return secondUrl[0] + '.' + secondUrl[1];
}

const userLogin = async function (req, res) {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            req.flash("fail", "All fields must be filled");
            return res.redirect("/login");
        }

        let user = await userSchema.findOne({ email });

        if (!user) {
            req.flash("fail", "User does not exist with this email");
            return res.redirect("/login");
        }

        if (!(await user.isMatchPassword(password))) {
            req.flash("fail", "Incorrect Password");
            return res.redirect("/login");
        }

        let { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);

        res.user = user;

        res.cookie("accessToken", accessToken);

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        return res.redirect("/");


    } catch (error) {
        console.log(`An error occurred from file user.controller.js in userLogin function :\n ${error}`);
        throw error;
    }

}
const userRegister = async function (req, res) {
    try {

        const { userName, fullName, email, password, confirmPassword } = req.body;

        if (!userName || !fullName || !email || !password || !confirmPassword) {
            req.flash("fail", "All fields must be filled");
            return res.redirect("/register");
        }

        if (password !== confirmPassword) {
            req.flash("fail", "Password did't match");
            return res.redirect("/register");
        }

        let existedUser = await userSchema.findOne({
            $or: [{ userName }, { email }]
        })

        if (existedUser) {
            req.flash("fail", "User already exist with this email or user name");
            return res.redirect("/register");
        }

        await userSchema.create({
            userName,
            fullName,
            email,
            password
        })
        req.flash("success", "Registration successful");
        return res.redirect("/login")

    } catch (error) {
        console.log(`An error occurred from file user.controller.js in userRegister function :\n ${error}`);
        throw error;
    }
}

const userLogOut = async function (req, res) {
    let token = req.cookies?.accessToken || req.header["Authorization"]?.replace("Bearer ", "");

    if (!token) {
        req.flash("fail", "Log in fisrt");
        return res.redirect("/login");

    }

    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await userSchema.findOne({ _id: decoded._id });

    user.refreshToken = "";

    user.save({ validateBeforeSave: false });

    res.clearCookie("accessToken");

    return res.redirect("/");
}

const postBlog = async function (req, res) {

    try {
        const { heading, content } = req.body;

        if (!heading || !content) {
            return res.status(401).json({
                message: "All fields must be filled"
            })
        }

        const decoded = await jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {

            req.flash("fail", "Login first");
            return res.redirect("/login");
        }

        const filePath = path.join(__dirname, "../public/uploads/", req.file.filename);

        const uploadCoverImageLink = await uploadCoverImage(filePath, req.file.filename);

        fs.unlinkSync(filePath);

        const blog = await blogSchema.create({
            user: decoded._id,
            content: content,
            blogImage: uploadCoverImageLink.url,
            heading: heading
        })

        return res.redirect('/');

    } catch (error) {
        return res.redirect("/post");
    }

}

const updateProfile = async function (req, res) {

    try {
        const { fullName, email } = req.body;

        const decoded = await jwt.verify(req.cookies?.accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await userSchema.findOne({ email: decoded.email });

        try {
            if (req.file) {
                const filePath = path.join(__dirname, `../public/uploads/${req.file.filename}`);
                const uploadAvaterLink = await uploadAvater(filePath, req.file.filename);

                const prevImage = extractPublicId(user.avater);
                await deleteImage(prevImage);

                try {
                    fs.unlinkSync(filePath)
                } catch (error) { }
                user.avater = uploadAvaterLink.url;
            }
        }
        catch (err) {
            console.log(err);
            console.log("An error occurred!!");
        }

        user.fullName = fullName;
        user.email = email;

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);
        user.refreshToken = refreshToken;
        res.cookie("accessToken", accessToken);

        user.save({ validateBeforeSave: false });

        res.locals.user = user;

        req.flash("success", "Profile updated successfully");
        res.redirect("/user");


    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

const displayProfile = async function (req, res, next) {

    const decoded = await jwt.verify(req.cookies?.accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await userSchema.findOne({ email: decoded.email });

    const blogs = await blogSchema.find({ user: decoded._id });

    res.locals.blogs = blogs;
    res.locals.user = user;

    res.render("user");
}

const editContent = async function (req, res, next) {

    const myUrl = url.parse(req.url);

    const blogId = myUrl.query.replace("query=", "");

    const { heading, content } = req.body;

    if (!heading || !content) {

        req.flash("fail", "All fields must be filled.");

        return res.redirect("/user");
    }

    try {

        const blog = await blogSchema.findById(blogId);

        blog.heading = heading;
        blog.content = content;

        blog.save({ validateBeforeSave: false });

        return res.redirect(`/blog?query=${blogId}`);

    } catch (error) {

        console.log(error);

        req.flash("fail", "Blog updation failed. Please try again..");
    }

    return res.redirect("/user");

}

const deleteContent = async function (req, res, next) {

    const myUrl = url.parse(req.url);

    try {

        const blogId = myUrl.query.replace("query=", "");

        let blog = await blogSchema.findById(blogId);

        const blogImageName = extractPublicId(blog.blogImage);

        await deleteImage(blogImageName);

        await blogSchema.deleteOne({ _id: blogId });

        req.flash("success", "Blog deleted successfully");



    } catch (error) {

        console.log(error);

        req.flash("fail", "Blog deletion failed. Please try again..");
    }

    return res.redirect("/user");

}

module.exports = {
    userLogin,
    userRegister,
    postBlog,
    updateProfile,
    displayProfile,
    userLogOut,
    editContent,
    deleteContent
}