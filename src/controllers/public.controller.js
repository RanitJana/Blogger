import blogSchema from "../models/blog.model.js";
import userSchema from "../models/user.model.js";
import likeSchema from "../models/like.model.js";
import commentSchema from "../models/comment.model.js";

import url from "url";
import jwt from "jsonwebtoken";

async function getAllRandomBlogs() {
    try {
        const totalCount = await blogSchema.countDocuments();
        const blogs = await blogSchema.aggregate([{ $sample: { size: totalCount } }]);
        const ans = await blogSchema.populate(blogs, "user");
        return ans;
    } catch (err) {
        console.error(err);
    }
}

const displayHome = async function (req, res) {

    let blog = await getAllRandomBlogs();
    let likes = await likeSchema.find();

    let tempBlogs = await Promise.all(blog.map(async (val) => {
        val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        let likeIndex = likes.findIndex(element => element.blog.toString() === val._id.toString());
        val.likes = likes[likeIndex]?.likers?.length || 0;

        let total = await commentSchema.countDocuments({ blog: val._id.toString() });
        val.comments = total;

        return val;
    }));

    res.locals.blog = tempBlogs;

    return res.render("home")
}

const displayBlog = async function (req, res) {

    try {

        const myUrl = url.parse(req.url);
        const queryId = myUrl.query.replace("query=", "");

        const blog = await blogSchema.findById(queryId).populate("user");

        let likes = await likeSchema.findOne({ blog: queryId });

        blog.formattedDate = blog.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        blog.likes = likes.likers?.length || 0;

        blog.likeImgHref = "/images/icons8-like-32.png";

        if (likes.likers) {

            try {

                const token = req.cookies?.accessToken || req.header["Authentication"]?.replace("Bearer ", "");
                const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

                likes.likers.forEach(like => {
                    if (like.toString() === decoded._id) blog.likeImgHref = "/images/icons8-like-24.png";
                })
            }
            catch (err) { }
        }

        res.locals.blog = blog;

        return res.render("blog");

    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

const displayWriter = async function (req, res) {
    try {

        let myUrl = url.parse(req.url);

        let userId = myUrl.query.replace("query=", "");

        let blogNotPopulate = await blogSchema.find({ user: userId });

        let blogs = await blogSchema.populate(blogNotPopulate, 'user');

        let likes = await likeSchema.find();

        let tempBlogs = await Promise.all(blogs.map(async (val) => {
            val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
                month: 'short', day: '2-digit', year: 'numeric'
            });

            let likeIndex = likes.findIndex(element => element.blog.toString() === val._id.toString());
            val.likes = likes[likeIndex]?.likers?.length || 0;

            let total = await commentSchema.countDocuments({ blog: val._id.toString() });
            val.comments = total;

            return val;
        }));

        res.locals.blogs = tempBlogs;

        return res.render("writer");

    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

const sendComments = async function (req, res) {

    try {

        let myUrl = url.parse(req.url);

        let blogId = myUrl.query.replace("query=", "");

        let allComment = await commentSchema.find({ blog: blogId }).populate("user");

        let newArray = allComment.map(val => {
            return {
                comment: val.content,
                userAvater: val.user.avater,
                userName: val.user.fullName
            }

        })

        return res.status(200).json({ newArray });

    } catch (error) {
        console.log(error);
    }
    return res.status(500).json({
        messagge: "Server error"
    })

}

export {
    displayHome,
    displayBlog,
    displayWriter,
    sendComments
}