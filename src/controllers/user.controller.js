import userSchema from "../models/user.model.js";
import blogSchema from "../models/blog.model.js";
import likeSchema from "../models/like.model.js";
import commentSchema from "../models/comment.model.js";

import { uploadAvater, uploadCoverImage, deleteImage } from "../utils/cloudinary.js";

import url from "url";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

        const like = await likeSchema.create({
            blog: blog._id
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

        let user = await userSchema.findOne({ email: email });

        if (user && (user._id != decoded._id)) {

            req.flash("fail", `${user.email} is already registerd by another user`);
            return res.redirect("/user");
        }

        user = await userSchema.findOne({ email: decoded.email });

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

        await likeSchema.deleteOne({ blog: blogId });

        req.flash("success", "Blog deleted successfully");



    } catch (error) {

        console.log(error);

        req.flash("fail", "Blog deletion failed. Please try again..");
    }

    return res.redirect("/user");

}

const likeContent = async function (req, res, next) {

    const token = req.cookies?.accessToken || req.header["Authentication"]?.replace("Bearer ", "");

    if (!token) {

        req.flash("fail", "You need to login first");

        return res.status(401).json({
            message: "login first"
        });
    }

    try {

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let user = await userSchema.findById(decoded._id);

        if (!user) {

            req.flash("fail", "Invalid user. Please log in again");

            return res.status(401).json({
                message: "Invalid user. Please log in again"
            });
        }

        const myUrl = url.parse(req.url);

        const blogId = myUrl.query.replace("query=", "");

        const like = await likeSchema.findOne({ blog: blogId });

        if (!like) return res.redirect("/");


        let index = like.likers.indexOf(user._id);

        if (index === -1) like.likers.push(user._id);

        else like.likers.splice(index, 1);


        like.save({ validateBeforeSave: false });


        let likeImgHref = "/images/icons8-like-32.png";

        if (like.likers) {

            try {

                const token = req.cookies?.accessToken || req.header["Authentication"]?.replace("Bearer ", "");
                const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

                like.likers.forEach(val => {
                    if (val.toString() === decoded._id) likeImgHref = "/images/icons8-like-24.png";
                })
            }
            catch (err) { }
        }

        return res.status(200).json({
            totalLikes: like.likers.length,
            likeImgHref
        })

    }
    catch (err) {
        console.log(`An error occurred : ${err}`);
    }

    return res.status(500).json({
        message: "Server problem"
    });
}

const commentContent = async function (req, res, next) {

    const mainComment = req.body.mainComment;

    let token = req.cookies?.accessToken || req.header["Authentication"]?.replace("Bearer ", "");

    if (!token) {
        req.flash("fail", "You nedd to log in first to comment")
        return res.status(401).json({
            message: "Log in"
        })
    }

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) return res.status(401).json({
        message: "Invalid user. Please log in again"
    });

    try {

        let user = await userSchema.findById(decoded._id);

        const myUrl = url.parse(req.url);

        const blogId = myUrl.query.replace("query=", "");

        let comment = await commentSchema.create({
            user: user._id,
            blog: blogId,
            content: mainComment
        });

        let dateTime = comment.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        return res.status(200).json({
            userAvater: user.avater,
            userName: user.fullName,
            comment: mainComment,
            date: dateTime
        })

    } catch (error) {
        console.log(error);
    }
    return res.status(500).json({
        message: "Server Error"
    });
}

export {
    userLogin,
    userRegister,
    postBlog,
    updateProfile,
    displayProfile,
    userLogOut,
    editContent,
    deleteContent,
    likeContent,
    commentContent
}